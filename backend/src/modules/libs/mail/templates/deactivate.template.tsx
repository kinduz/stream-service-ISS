import { APP_LOGO_URL_FOR_EMAIL } from '../constants/mail.constants';
import { SessionMetadata } from '@/src/shared/types/session-metadata.types';
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
	Text,
} from '@react-email/components';
import { Html } from '@react-email/html';
import * as React from 'react';

type TDeactivationProps = {
	token: string;
	metadata: SessionMetadata;
	username: string;
};

export const DeactivationTemplate = ({
	token,
	username,
	metadata,
}: TDeactivationProps) => {
	return (
		<Html>
			<Tailwind>
				<Head />
				<Body className='bg-white text-gray-800'>
					<Container className='p-5 mx-auto bg-gray-100'>
						<Section className='bg-white'>
							<Section className='bg-gray-900 flex py-5 px-5 items-center justify-center'>
								<Img
									src={APP_LOGO_URL_FOR_EMAIL}
									alt='ISS logo'
								/>
							</Section>
							<Section className='p-6 md:p-8 flex items-center'>
								<Heading className='text-2xl font-bold text-gray-700 mb-4'>
									Деактивация аккаунта
								</Heading>
								<Text className='text-m leading-relaxed mb-4'>
									Привет, {username}!
									<br />
									<br />
									Вы произвели запрос на деактивацию вашего
									аккаунта в <b>ISS</b>.
									<br />
									<br />
									Ваш код потверждения:
								</Text>
								<Text className='text-xl font-bold'>{token}</Text>
								<Hr />
								<Text className='text-gray-700 text-m leading-relaxed'>
									Информация о запросе:
								</Text>
								<ul className='list-disc list-inside mt-2 text-sm text-black'>
									<li>
										🌍 Расположение:{' '}
										{metadata.location.country},{' '}
										{metadata.location.city}
									</li>
									<li>
										📱 Операционная система:{' '}
										{metadata.device.os}
									</li>
									<li>
										🌐 Браузер: {metadata.device.browser}
									</li>
									<li>💻 IP-адрес: {metadata.ip}</li>
								</ul>
								<Text className='text-gray-700 text-sm italic leading-relaxed'>
									Если вы не хотите удалять ваш аккаунт или вы
									не отправляли такой запрос, то просто
									проигнорируйте это письмо и удалите его.
								</Text>
							</Section>
							<Hr />
							<Section className='p-6 md:p-8'>
								<Text className='text-sm text-gray-700'>
									ISS никогда не попросит вас сообщить ваши
									персональные данные (пароль, адрес,
									реквизиты банковской карты и т.д)
								</Text>
							</Section>
						</Section>
						<Text className='text-xs text-gray-700 leading-relaxed px-5'>
							Это сообщение сформировано и отправлено ISS, SRTech
							Inc., Россия, г. Москва. © 2025, Is That Stream
							(ISS), SRTech Inc.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
