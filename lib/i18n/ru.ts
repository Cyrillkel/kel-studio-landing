import ru from "@/locales/ru.json";
import { createI18n } from "./create";

// Russian pages ship only the Russian texts (English ones ship only English).
export const i18nRu = createI18n("ru", ru);
