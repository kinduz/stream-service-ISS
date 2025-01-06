import type { Request } from "express";
import { SessionMetadata } from "../types/session-metadata.types";
import { IS_DEV_ENV } from "./is-dev.util";
import * as countries from "i18n-iso-countries";
import {lookup} from "geoip-lite";

import { MOCK_IP } from "../constants/mock.constants";

import DeviceDetector = require("device-detector-js");

const currentLanguage = require("i18n-iso-countries/langs/ru.json");
countries.registerLocale(currentLanguage)

export const getSessionMetadata = (req: Request, userAgent: string): SessionMetadata => {

    const ip = IS_DEV_ENV 
        ? MOCK_IP 
        : Array.isArray(req.headers['cf-connecting-ip']) 
            ? req.headers['cf-connecting-ip'][0] 
            : req.headers['cf-connecting-ip'] || 
                (typeof req.headers['x-forwarded-for'] === 'string' ? req.headers['x-forwarded-for'].split(',')[0] : req.ip);

    const device = new DeviceDetector().parse(userAgent);
    const location = lookup(ip);

    return {
        ip,
        location: {
            country: countries.getName(location.country, 'ru') || "",
            city: location.city,
            latidute: location.ll[0],
            longitude: location.ll[1]
        },
        device: {
            browser: device.client.name,
            os: device.os.name,
            type: device.device.type
        }
    }
} 