import nodemailer from 'nodemailer'

export const emailRegister=async(data)=>{
    const {name, email, token}=data

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });

    const info= await transport.sendMail({
        from:'"UpTask-Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: 'UpTask - Confirma tu cuenta',
        text: 'Comprueba tu cuenta',
        html: `<p>Hola: ${name} por favor confirma tu cuenta en UpTask<p>
        <p>Confimar en el siguiente enlace:

        <a href='${process.env.FRONT_URL_L}/confirm/${token}'>Confirmar Cuenta<a/>

        <p>Si tu no creaste esta cuenta, ignora este correo<p/>
        `,
    })

}

export const emailForgetPassword=async(data)=>{
    const {name, email, token}=data

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });

    const info= await transport.sendMail({
        from:'"UpTask-Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: 'UpTask - Restablecer Clave',
        text: 'Restablecer Clave',
        html: `<p>Hola: ${name} has solicitado restablecer tu clave<p>

        <p>Sigue el siguiente enlace para generar una nueva clave:

        <a href='${process.env.FRONT_URL_L}/forgetPassword/${token}'>Restablecer Clave<a/>

        <p>Si tu no solicitaste este email, ignora este correo<p/>
        `,
    })

}