<template>

  <v-container class="text-center"  >
    <v-row   align="center">
      <v-col md="6" offset-md="3">

        <h1>Change Password</h1>
        <br>

        <v-card class="pa-5 elevation-10" color="">
          <v-form v-model="valid" ref="formType" lazy-validation>

            <v-text-field
              name="input-10-2"
              label="Currrent password"
              :append-icon="e3 ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => (e3 = !e3)"
              v-model="passwordDetails.currentPassword"
              :rules="formRules.password"
              :type="e3 ? 'password' : 'text'"
            ></v-text-field>

            <v-text-field
              name="input-10-2"
              label="New password"
              :append-icon="e4 ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => (e4 = !e4)"
              v-model="passwordDetails.newPassword"
              :rules="formRules.password"
              :type="e4 ? 'password' : 'text'"
            ></v-text-field>

            <v-text-field
              name="input-10-2"
              label="Confirm new password"
              :append-icon="e5 ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => (e5 = !e5)"
              v-model="passwordDetails.verifyPassword"
              :rules="formRules.password"
              :type="e5 ? 'password' : 'text'"
            ></v-text-field>



            <v-btn
              @click="resetUserPassword"
              color="primary"
              large
              :disabled="!valid">
              SAVE PASSWORD
            </v-btn>

          </v-form>
        </v-card>
      </v-col>
    </v-row>

  </v-container>


  <!--<section class="section container">-->

    <!--<div class="box">-->

      <!--<div class="field">-->
        <!--<div class="control">-->
          <!--<label class="label">currentPassword</label>-->
          <!--<input class="input" type="password" placeholder="currentPassword" id="currentPassword" v-model="passwordDetails.currentPassword">-->
        <!--</div>-->
      <!--</div>-->

      <!--<div class="field">-->
        <!--<div class="control">-->
          <!--<label class="label">newPassword</label>-->
          <!--<input class="input" type="password" placeholder="newPassword" id="newPassword" v-model="passwordDetails.newPassword">-->
        <!--</div>-->
      <!--</div>-->

      <!--<div class="field">-->
        <!--<div class="control">-->
          <!--<label class="label">verifyPassword</label>-->
          <!--<input class="input" type="password" placeholder="verifyPassword" id="verifyPassword" v-model="passwordDetails.verifyPassword">-->
        <!--</div>-->
      <!--</div>-->

      <!--<div class="field is-grouped">-->
        <!--<div class="control">-->
          <!--<button class="button is-link" @click="resetUserPassword">Reset Password</button>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->


    <!---->

  <!--</section>-->


</template>

<script>
  import {isEmail} from "@/helpers";

  export default {
    data() {
      return {
        passwordDetails : {
          newPassword : null,
          verifyPassword : null,
          currentPassword:null,
          oldPassword : null
        },
        e3:true,
        e4:true,
        e5:true,
        valid:true,
        formRules: {
          email: [
            v => !!v || 'E-mail is required',
            v => isEmail(v) || 'E-mail must be valid'
          ],
          password: [
            v => !!v || 'Password is required'
          ],
        },

      }
    },
    computed : {
    },
    methods : {

      async resetUserPassword(e){
        e.preventDefault();
        //console.log('passworDetails',this.passwordDetails);
        await this.$store.dispatch('ActPostPasswordChange',this.passwordDetails)
      }

    },
    beforeCreated () {},
    created () { },
    mounted () {},
    beforeDestroy () {},
    destroy () {},
    validate({params}) { return true },
    head() { return {} },
    props: { },
    watch: { },
    directives : { },
    components : { }
  }
</script>

<style scoped>

</style>
<!--
/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 *
 * @author Naveen MR <oof1lab@gmail.com>
 * @author Pranav C Balan <pranavxc@gmail.com>
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
-->
