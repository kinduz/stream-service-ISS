import { 
    Body, 
    Container, 
    Head, 
    Heading, 
    Hr, 
    Img, 
    Section, 
    Tailwind, 
    Text 
} from "@react-email/components";
import { Html } from "@react-email/html";
import * as React from "react"
import { APP_LOGO_URL_FOR_EMAIL } from "../constants/mail.constants";

type TDeletionProps = {
    username: string;
}

export const DeletionTemplate = ({username}: TDeletionProps) => {
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
                        Ваш аккаунт был полностью удален
                    </Heading>
                    <Text className="text-gray-700 text-sm leading-relaxed mb-4">
                        {username}, ваш аккаунт был удален. Вся информация о вас была полностью стерта из базы данных ISS. Все ваши данные были удалены безвозвратно.
                    </Text>
                    <Hr/>
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