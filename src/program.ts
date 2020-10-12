/* eslint-disable no-console */
import { schedule } from 'node-cron';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { name, lorem } from 'faker/locale/en_AU';

const template = 'authenticity_token=D8hw0aa2mdJyHTqmpalp9KDZttOxBOnSqqzko73F1Mg%3D&simulated=1&ss_token=Gv2VKxLoY4E33S8EuChoVA%3D%3D&ss_timestamp=1595744216&ss_url_path=8FBCfX&ss_user_agent=Mozilla%2F5.0+(Windows+NT+10.0%3B+Win64%3B+x64%3B+rv%3A78.0)+Gecko%2F20100101+Firefox%2F78.0&fb_api_version=3&ss_avi=1857848932&referring_entry_id=0&disable_restrictions=false&form%5Bfirst_name%5D=firstNamePlaceholder&form%5Blast_name%5D=lastNamePlaceholder&form%5Bemail%5D=emailPlaceholder%2BaliasPlaceholder%40gmail.com&form%5Bagree%5D=1';
const firstName = process.env.FIRSTNAME || name.firstName();
const lastName = name.lastName();
const alias = process.env.FIRSTNAME || lorem.word();

const body = template
  .replace(
    'aliasPlaceholder',
    `${alias}${Math.floor(Math.random() * 888888)}`,
  )
  .replace('firstNamePlaceholder', firstName)
  .replace('lastNamePlaceholder', lastName)
  .replace('emailPlaceholder', process.env.GMAIL);



const run = (body: string) => {
  fetch('https://[REDACTED]/facebook/form/82557730', {
    method: 'POST',
    body,
    headers: {
      Host: '[REDACTED]',
      Origin: 'https://[REDACTED]',
      DNT: '1',
      Referer: 'https://[REDACTED]/',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })
    .then((response) => response.json())
    .then((json) => parseJSON(json));
};

const parseJSON = (json: any): void => {
  const win = json.instant_winner;
  const { message } = json;
  const entryId = json.entry_id;
  const emailInvalid = json.errors.email;

  if (win) {
    console.log(`Won with entryId: ${entryId}, message: ${message}`);
  } else {
    console.log(`Failed: ${message}${emailInvalid ? `, ${emailInvalid}` : ''}`);
  }
};

dotenv.config();
if (!process.env.EMAIL){
  throw Error('Email in .env is required.');
}
run(body);
schedule('*/1 * * * *', () => {
  run(body);
});
