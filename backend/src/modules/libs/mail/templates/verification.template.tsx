import { Body, Head, Heading, Hr, Link, Preview, Section, Tailwind, Text } from "@react-email/components";
import { Html } from "@react-email/html";
import * as React from "react"

type TVerificationProps = {
    domain: string;
    token: string;
    username: string;
}

export const VerificationTemplate = ({domain, token, username}: TVerificationProps) => {
    const verificationLink = `${domain}/account/verify?token=${token}`;

    return (
        <Html>
            <Head/>
            <Preview>ISS: верификация аккаунта</Preview>
            <Tailwind>
                <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
                    <Section className="text-center mb-8">
                        <Heading as="h2" className="text-3xl text-black font-bold">
                            Привет, {username}. Подтвердите ваш адрес электронной почты
                        </Heading>
                        <Text className="text-base text-black">
                            {username}, спасибо за регистрацию в ISS! Нам нужно убедиться, что этот адрес электронной почты действительно принадлежит Вам.
                            Пожалуйста, перейдите по ссылке ниже, чтобы подтвердить ваш аккаунт. Если Вы не создавали аккаунт в ISS, просто проигнорируйте это письмо.
                        </Text>
                        <Hr/>
                        <Link 
                            href={verificationLink} 
                            className="
                            inline-flex justify-center items-center rounded-full 
                            px-5 py-2 text-sm font-medium text-blue bg-[#18B9AE]"
                        >
                            👉 Ваша магическая ссылка для подверждения аккаунта 👈
                        </Link>
                        <Text
                            style={{
                            textAlign: "center",
                            fontSize: 12,
                            color: "rgb(0,0,0, 0.7)",
                            }}
                        >
                            © 2025 | Москва. По всем вопросам вы можете писать на почту 
                            <Link href="mailto:egor.shvedov.dev@gmail.com" className="underline">
                                egor.shvedov.dev@gmail.com
                            </Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}