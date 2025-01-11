import { SessionMetadata } from "@/src/shared/types/session-metadata.types";
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

type TResetPasswordProps = {
    domain: string;
    token: string;
    metadata: SessionMetadata;
    username: string;
}

export const ResetPasswordTemplate = ({domain, token, username, metadata}: TResetPasswordProps) => {
    const resetPasswordLink = `${domain}/account/recovery?token=${token}`;

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
                          Сброс пароля
                      </Heading>
                      <Text className="text-gray-700 text-m leading-relaxed mb-4">
                        Привет, {username}!
                          <br/>
                          <br/>
                          Кто-то недавно отправил запрос на сброс пароля для вашего аккаунта в ISS. 
                          <br/>
                          <br/>
                          Информация о запросе:
                      </Text>
                      <ul className="list-disc list-inside mt-2 text-sm text-black">
                            <li>🌍 {" "} Расположение: {metadata.location.country}, {metadata.location.city}</li>
							<li>📱 {" "} Операционная система: {metadata.device.os}</li>
							<li>🌐 {" "} Браузер: {metadata.device.browser}</li>
							<li>💻 {" "} IP-адрес: {metadata.ip}</li>
                      </ul>
                      <Hr />
                      <Text className="text-gray-700 text-sm leading-relaxed mb-4">
                          Если это сделали вы, вы можете сбросить пароль здесь:
                      </Text>
                      <Section className="flex flex-col justify-center items-center mb-8">
                          <Link 
                              href={resetPasswordLink} 
                              className="
                              flex justify-center items-center rounded-full 
                              px-5 py-2 text-xl font-medium text-white bg-[#252F3D]"
                          >
                              Сбросить пароль
                          </Link>
                      </Section>
                      <Text className="text-gray-700 text-sm italic leading-relaxed">
                        Если вы не хотите менять ваш пароль или вы не отправляли такой запрос, то просто проигнорируйте это письмо и удалите его.
                      </Text>
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