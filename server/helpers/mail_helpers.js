const path = require('path');
const nodemailer = require('nodemailer');
const { BASE_PROJECT_DIR, MAIL_ACCOUNT, SITE_URL } = require('../constants');
const mailAccount = nodemailer.createTransport({
    host: 'smtp.mail.us-east-1.awsapps.com',
    //service: 'service_bylhdoi',
    port: 465,
    secure: true,
    auth: {
        user: MAIL_ACCOUNT,
        pass: 'Ecopromo123*' 
    }
});

async function sendMail(to, subject, message, attachments) {

    const mailMessage = {
        from: 'contato@ecopromo.com.br',
        to: to,
        subject: subject,
        html: message,
        attachments: attachments
    };

    return await mailAccount.sendMail(mailMessage);
}

async function sendMailRecoveredPassToManager(name, mail, login, password) {

    let message = `<p><center><img src="cid:unique@logo" width="64" height="128"/></center></p>`;

    message += `<p><center><b><h2>Ecopromos - Recuperação de senha</h2></b></center><p>`;
    message += `<p/></p>`;
    message += `<p>Olá ${name.split(" ")[0]}, estamos enviando para você a sua senha, caso não consiga fazer o login, entre em contato com o nosso suporte técnico.`;
    message += `<br/><br/>`;
    message += `<p><b>Login:</b> ${login}`;
    message += `<p><b>Senha:</b> ${password}`;
    message += `<br/><br/>`;
    message += `<p>Atenciosamente</p>`;
    message += `<p>Equipe Ecopromos</p>`;
    message += `<hr/>`;

    await sendMail(mail, 'Envio de senha', message, [{
        filename: 'ecopromos.png',
        path: path.join(`${BASE_PROJECT_DIR}`, '/images/general/ecopromos.png'),
        cid: 'unique@logo'
    }]);
}

async function sendMailClientRegistrationConfirmation(name, mail, token) {

    let link = `${SITE_URL}/clients/register/confirm/${token}`;
    let message = `<p><center><img src="cid:unique@logo" width="64" height="128"/></center></p>`;

    message += `<p><center><b><h2>Ecopromos - Confirmação de cadastro</h2></b></center><p>`;
    message += `<p/></p>`;
    message += `<p>Olá ${name.split(" ")[0]}, seja bem-vindo ao Ecopromos ;), estamos enviando para você o link para que você possa confirmar o seu cadastro.`;
    message += '<p>Clique no link abaixo para confirmar o seu cadastro, se o link não estiver funcionando, copie e cole na barra de endereços de seu navegador.</p>';
    message += '<p><b>Observação: </b>o link de confirmação de cadastro tem um prazo de 24 horas, após este prazo o seu cadastro será excluído automaticamente caso a confirmação não seja realizada.</p>';
    message += `<br/><br/>`;
    message += `<p><b>Link: </b>${link}</p>`;
    message += `<br/><br/>`;
    message += `<p>Atenciosamente</p>`;
    message += `<p>Equipe Ecopromos</p>`;
    message += `<hr/>`;

    await sendMail(mail, 'Confirmação de cadastro', message, [{
        filename: 'ecopromos.png',
        path: path.join(`${BASE_PROJECT_DIR}`, '/images/general/ecopromos.png'),
        cid: 'unique@logo'
    }]);
}

async function sendMailRecoveredPassToClient(name, mail, token) {

    let link = `${SITE_URL}/clients/password/recover/${token}`;
    let message = `<p><center><img src="cid:unique@logo" width="64" height="128"/></center></p>`;

    message += `<p><center><b><h2>Ecopromos - Recuperação de senha</h2></b></center><p>`;
    message += `<p/></p>`;
    message += `<p>Olá ${name.split(" ")[0]}, estamos enviando para você o link para que você possa recuperar a sua senha.`;
    message += '<p>Clique no link abaixo para confirmar o seu cadastro, se o link não estiver funcionando, copie e cole na barra de endereços de seu navegador.</p>';
    message += `<br/><br/>`;
    message += `<p><b>Link: </b>${link}</p>`;
    message += `<br/><br/>`;
    message += `<p>Atenciosamente</p>`;
    message += `<p>Equipe Ecopromos</p>`;
    message += `<hr/>`;

    await sendMail(mail, 'Recuperação de senha', message, [{
        filename: 'ecopromos.png',
        path: path.join(`${BASE_PROJECT_DIR}`, '/images/general/ecopromos.png'),
        cid: 'unique@logo'
    }]);
}

async function sendMailRecoveredPassToUser(name, mail, password) {

    //let message = `<p><center><img src="cid:unique@logo" width="64" height="128"/></center></p>`;
    let message = ``;

    message += `<p><center><b><h2>Ecopromos - Recuperação de senha</h2></b></center><p>`;
    message += `<p/></p>`;
    message += `<p>Olá ${name.split(" ")[0]}, estamos enviando para você a sua senha, caso não consiga fazer o login, entre em contato com o nosso suporte técnico.`;
    message += `<br/><br/>`;
    message += `<p><b>Email:</b> ${mail}`;
    message += `<p><b>Senha:</b> ${password}`;
    message += `<br/><br/>`;
    message += `<p>Atenciosamente</p>`;
    message += `<p>Equipe Ecopromos</p>`;
    message += `<hr/>`;

    await sendMail(mail, 'Envio de senha', message);
}

module.exports = { 
    sendMailRecoveredPassToManager,
    sendMailClientRegistrationConfirmation,
    sendMailRecoveredPassToClient,
    sendMailRecoveredPassToUser
};