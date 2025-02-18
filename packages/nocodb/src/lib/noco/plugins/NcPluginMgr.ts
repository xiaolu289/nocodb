import NcMetaIO from "../meta/NcMetaIO";
import {
  IEmailAdapter,
  IStorageAdapter,
  IWebhookNotificationAdapter,
  XcEmailPlugin,
  XcPlugin,
  XcStoragePlugin, XcWebhookNotificationPlugin
} from "nc-plugin";

import S3PluginConfig from "../../../plugins/s3";
import GcsPluginConfig from "../../../plugins/gcs";
import LinodePluginConfig from "../../../plugins/linode";
import BackblazePluginConfig from "../../../plugins/backblaze";
import VultrPluginConfig from "../../../plugins/vultr";
import OvhCloudPluginConfig from "../../../plugins/ovhCloud";
import MinioPluginConfig from "../../../plugins/mino";
import SpacesPluginConfig from "../../../plugins/spaces";
import UpcloudPluginConfig from "../../../plugins/upcloud";
import SMTPPluginConfig from "../../../plugins/smtp";
import SlackPluginConfig from "../../../plugins/slack";
import TeamsPluginConfig from "../../../plugins/teams";
import MattermostPluginConfig from "../../../plugins/mattermost";
import DiscordPluginConfig from "../../../plugins/discord";
import TwilioWhatsappPluginConfig from "../../../plugins/twilioWhatsapp";
import TwilioPluginConfig from "../../../plugins/twilio";
import ScalewayPluginConfig from "../../../plugins/scaleway";

import Noco from "../Noco";
import Local from "./adapters/storage/Local";

const defaultPlugins = [
  SlackPluginConfig,
  TeamsPluginConfig,
  DiscordPluginConfig,
  TwilioWhatsappPluginConfig,
  TwilioPluginConfig,
  S3PluginConfig,
  MinioPluginConfig,
  GcsPluginConfig,
  MattermostPluginConfig,
  SpacesPluginConfig,
  BackblazePluginConfig,
  VultrPluginConfig,
  OvhCloudPluginConfig,
  LinodePluginConfig,
  UpcloudPluginConfig,
  SMTPPluginConfig,
  ScalewayPluginConfig,
]

class NcPluginMgr {

  private ncMeta: NcMetaIO;
  private app: Noco;

  /* active plugins */
  private activePlugins: Array<XcPlugin | XcStoragePlugin | XcEmailPlugin>

  constructor(app: Noco, ncMeta: NcMetaIO) {
    this.app = app;
    this.ncMeta = ncMeta;
    this.activePlugins = [];
  }

  public async init(): Promise<void> {

    /* Populate rows into nc_plugins table if not present */
    for (const plugin of defaultPlugins) {

      const pluginConfig = (await this.ncMeta.metaGet(null, null, 'nc_plugins', {
        title: plugin.title
      }));

      if (!pluginConfig) {

        await this.ncMeta.metaInsert(null, null, 'nc_plugins', {
          title: plugin.title,
          version: plugin.version,
          logo: plugin.logo,
          description: plugin.description,
          tags: plugin.tags,
          category: plugin.category,
          input_schema: JSON.stringify(plugin.inputs)
        });

      }

      /* init only the active plugins */
      if (pluginConfig?.active) {

        const tempPlugin = new plugin.builder(this.app, plugin);

        this.activePlugins.push(tempPlugin);

        if (pluginConfig?.input) {
          pluginConfig.input = JSON.parse(pluginConfig.input);
        }

        try {
          await tempPlugin.init(pluginConfig?.input);
        } catch (e) {
          console.log(`Plugin(${plugin?.title}) initialization failed : ${e.message}`)
        }
      }

    }
  }


  public async reInit(): Promise<void> {
    this.activePlugins = [];
    await this.init();
  }


  public get storageAdapter(): IStorageAdapter {
    return (this.activePlugins?.find(plugin => plugin instanceof XcStoragePlugin) as XcStoragePlugin)?.getAdapter() || new Local();
  }

  public get emailAdapter(): IEmailAdapter {
    return (this.activePlugins?.find(plugin => plugin instanceof XcEmailPlugin) as XcEmailPlugin)?.getAdapter();
  }

  public get webhookNotificationAdapters(): { [key: string]: IWebhookNotificationAdapter } {
    return this.activePlugins?.reduce((obj, plugin) => {
      if (plugin instanceof XcWebhookNotificationPlugin) {
        obj[plugin?.config?.title] = (plugin as XcWebhookNotificationPlugin)?.getAdapter()
      }
      return obj;
    }, {});

  }

  public async test(args: any): Promise<boolean> {
    switch (args.category) {
      case 'Storage':
        const plugin = defaultPlugins.find(pluginConfig => pluginConfig?.title === args.title);
        const tempPlugin = new plugin.builder(this.app, plugin);
        await tempPlugin.init(args?.input);
        return tempPlugin?.getAdapter()?.test?.();
        break;
      default:
        throw new Error('Not implemented');
    }
  }

}

export default NcPluginMgr;

/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 *
 * @author Pranav C Balan <pranavxc@gmail.com>
 * @author Bhanu P Chaudhary <bhanu423@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */