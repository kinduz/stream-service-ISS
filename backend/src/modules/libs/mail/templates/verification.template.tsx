import { 
    Body, 
    Container, 
    Head, 
    Heading, 
    Hr, 
    Img, 
    Link, 
    Section, 
    Tailwind, 
    Text 
} from "@react-email/components";
import { Html } from "@react-email/html";
import * as React from "react"
import { APP_LOGO_URL_FOR_EMAIL } from "../constants/mail.constants";

type TVerificationProps = {
    domain: string;
    token: string;
    username: string;
}

export const VerificationTemplate = ({domain, token, username}: TVerificationProps) => {
    const verificationLink = `${domain}/account/verify?token=${token}`;

    return (
      <Html>
        <Tailwind>
        <Head />
            <Body className="bg-white text-gray-800">
                <Container className="p-5 mx-auto bg-gray-100">
                <Section className="bg-white">
                    <Section className="bg-gray-900 flex py-5 px-5 items-center justify-center">
                    <Img
                        src={APP_LOGO_URL_FOR_EMAIL}
                        alt="ISS logo"
                    />
                    </Section>
                    <Section className="p-6 md:p-8 flex items-center">
                    <Heading className="text-2xl font-bold text-gray-700 mb-4">
                        Подтвердите ваш аккаунт
                    </Heading>
                    <Text className="text-gray-700 text-sm leading-relaxed mb-4">
                        {username}, спасибо за регистрацию в ISS! Нам нужно убедиться, что этот адрес электронной почты действительно принадлежит Вам.
                        Пожалуйста, перейдите по ссылке ниже, чтобы подтвердить ваш аккаунт. Если Вы не создавали аккаунт в ISS, просто проигнорируйте это письмо.
                    </Text>
                    <Section className="flex flex-col justify-center items-center">
                        <Link 
                            href={verificationLink} 
                            className="
                            flex justify-center items-center rounded-full 
                            px-5 py-2 text-xl font-medium text-white bg-[#252F3D]"
                        >
                            Подтвердить аккаунт
                        </Link>
                    </Section>
                    </Section>
                    <Hr />
                    <Section className="p-6 md:p-8">
                    <Text className="text-sm text-gray-700">
                        ISS никогда не попросит вас сообщить ваши персональные данные (пароль, адрес, реквизиты банковской карты и т.д)
                    </Text>
                    </Section>
                </Section>
                <Text className="text-xs text-gray-700 leading-relaxed px-5">
                    Это сообщение сформировано и отправлено ISS, SRTech Inc., Россия, г. Москва. © 2025, Is That Stream (ISS), SRTech Inc.
                </Text>
                </Container>
            </Body>
        </Tailwind>
      </Html>
    )
}