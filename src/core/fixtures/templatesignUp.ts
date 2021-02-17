import * as Sentry from '@sentry/node'
module.exports = {

    signupMail: function(email: string, nickname: string): void{

        const mailjet = require ('node-mailjet').connect('523e4dc85ff4c09ff652456f98bbb2ad', '5d24fa2476e0dff8104e4f7e0cd77363')
        const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
          "Messages":[
            {
              "From": {
                "Email": "tenekeucabrel@gmail.com",
                "Name": "yvan"
              },
              "To": [
                {
                  "Email": email,
                  "Name": nickname
                }
              ],
              "Subject": "Bienvenue chez Biblio.",
              "TextPart": `${nickname} l'équipe de biblio vous souhaite la bienvenue `,
              "HTMLPart": "<h3>Connexion à <a href='https://bibliotech-serveur.herokuapp.com/'>Biblio</a>!</h3><br />",
              "CustomID": "connect user"
            }
          ]
        })
        request
          .then((result: { body: any }) => {
            console.log(result.body)
          })
          .catch((err: { statusCode: any }) => {
            Sentry.captureException(err)
            console.log(err.statusCode)
          })
    }

}