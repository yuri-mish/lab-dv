/* eslint-disable indent *//* eslint-disable linebreak-style */
'use strict';

const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');
const dbf = require('../db');
const https = require('https');

const token = config.env === 'prod' ? config.telegram.token : config.telegram.tokenDev;
const bot = new TelegramBot(token);

const connect = () => {
  console.log('Connecting bot.....');
    bot.setWebHook(config.telegram.host).then(res => {
      if (res) console.log(`Bot ${token} Connected .....${config.env}`);
      else console.log(`Not Connected .....${config.env}`);
    }).catch(e => {
        console.log('Bot connection error:', e);
      });
};

connect();

const messageHandler = (message) => {
    const chatid = message.chat.id;
    const textMessage = message.text;
    console.log(message);
    console.log('Bot message chatid:', chatid);
    console.log('Bot message body:', textMessage);

    if (textMessage && textMessage[0] === '*') {
        const options = {
          hostname: config.utp.httpServiceHost,
          port: 443,
          method: 'GET',
          path: `${config.utp.httpServicePath}/tgbot?com=reg&ukod=${textMessage}&chatid=${chatid}`,
          };
        const req = https.request(options);
        req.on('error', error => {
            console.error('Error send 1C httpService request:', error);
        });
        req.end();
    }
};

const callBackHandler = (req) => {
    const callBack = req.body.callback_query;
    const chatid = callBack.message.chat.id;
    const options = {
        hostname: config.utp.httpServiceHost,
        port: 443,
        method: 'GET'
      };
    let Param1C = '';
    let message = '';
    if (callBack.data) {
        // console.log(callBack.data);
        const [ command, id ] = callBack.data.split('|');
        console.log(command);
        console.log(id);
        switch (command) {
            case '000':
                dbf.updateStatus(`doc.priceorder|${id}`, 3); //Отменен
                message = 'Статус документа змінено: \u26D4 <b>Відхилено</b>';
                break;
                case '010':
                    message = ' \u{1F6A7} <b>*** Функціонал ще не реалізований ***</b> \u{1F6A7}';
                    break;
                case '020':
                    message = ' \u{2708} <b>*** Процес затвердження запущено ***</b>';
                    Param1C = `com=approve_price&doc=${id}&chatid=${callBack.from.id}`;
                    options.path = `${config.utp.httpServicePath}/tgbot?${Param1C}`;
                    https.get(options, () => { });
                    break;

                default:
                    return;
        }
    }
    bot.sendMessage(chatid, message, { parse_mode: 'html' });
};

const sendSoglasMessage = (message, users, docid) => {
    users.forEach(userid => {
        bot.sendMessage(userid, message, {
            parse_mode: 'html',
            reply_markup: {
              inline_keyboard: [
                [ {
                    text: '\u2705 Погодити',
                    callback_data: `010|${docid}`
                  },
                  {
                    text: '\u274C Відхилити',
                    callback_data: `000|${docid}`
                  },
             ]
              ] }
          })
            .catch(e => {
              console.log('=sendSoglas :', e);
            } );
});

    bot.send;
};

const sendApproveMessage = (message, users, docid) => {
    users.forEach(userid => {
        bot.sendMessage(userid, message, {
            parse_mode: 'html',
            reply_markup: {
              inline_keyboard: [
                [ {
                    text: '\u2705 Затвердити',
                    callback_data: `020|${docid}`
                  },
                  {
                    text: '\u26D4 Відхилити',
                    callback_data: `000|${docid}`
                  },
             ]
              ] }
          })
            .catch(e => {
              console.log('=sendApprove :', e);
            } );
});

    bot.send;
};

module.exports = {
    bot: bot,
    messageHandler: messageHandler,
    callBackHandler: callBackHandler,
    sendSoglasMessage: sendSoglasMessage,
    sendApproveMessage: sendApproveMessage,
    connect: connect,
};
