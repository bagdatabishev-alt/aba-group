"use client";

import { useLang } from "@/lib/i18n/LanguageContext";

const CONTENT = {
  kz: {
    eyebrow: "Заңды ақпарат",
    title: "Құпиялылық саясаты",
    updated: "Соңғы жаңартылған күні: 2026 жыл",
    sections: [
      ["1. Жиналатын ақпарат", "Тапсырыс беру немесе байланыс формасын толтыру кезінде біз атыңызды, телефон нөміріңізді, email мекенжайыңызды, жеткізу мекенжайыңызды және тапсырыс мазмұнын жинаймыз."],
      ["2. Ақпаратты пайдалану мақсаты", "Жиналған деректер тек тапсырысты өңдеу, жеткізуді ұйымдастыру және сізбен байланысу үшін қолданылады. Біз деректеріңізді үшінші тұлғаларға сатпаймыз және жарнама мақсатында бөлмейміз."],
      ["3. Деректерді сақтау", "Барлық деректер қауіпсіз серверлерде (Supabase инфрақұрылымында) сақталады және тек авторизацияланған компания қызметкерлеріне қолжетімді."],
      ["4. Сіздің құқықтарыңыз", "Сіз кез келген уақытта деректеріңізді жоюды немесе түзетуді сұрай аласыз. Ол үшін info@abagroup.kz мекенжайына хат жіберіңіз."],
      ["5. Байланыс", "Осы саясат бойынша сұрақтарыңыз болса, Байланыс бетіндегі деректер арқылы бізге хабарласыңыз."],
    ],
  },
  ru: {
    eyebrow: "Юридическая информация",
    title: "Политика конфиденциальности",
    updated: "Последнее обновление: 2026 год",
    sections: [
      ["1. Собираемая информация", "При оформлении заказа или заполнении формы обратной связи мы собираем ваше имя, номер телефона, email, адрес доставки и содержимое заказа."],
      ["2. Цель использования информации", "Собранные данные используются только для обработки заказа, организации доставки и связи с вами. Мы не продаём ваши данные третьим лицам и не используем их в рекламных целях."],
      ["3. Хранение данных", "Все данные хранятся на защищённых серверах (инфраструктура Supabase) и доступны только авторизованным сотрудникам компании."],
      ["4. Ваши права", "Вы можете в любой момент запросить удаление или исправление своих данных, написав на info@abagroup.kz."],
      ["5. Контакты", "По вопросам этой политики свяжитесь с нами через данные на странице Контакты."],
    ],
  },
  en: {
    eyebrow: "Legal Information",
    title: "Privacy Policy",
    updated: "Last updated: 2026",
    sections: [
      ["1. Information We Collect", "When placing an order or filling out the contact form, we collect your name, phone number, email address, delivery address, and order details."],
      ["2. How We Use Information", "Collected data is used solely to process orders, arrange delivery, and communicate with you. We do not sell your data to third parties or use it for advertising purposes."],
      ["3. Data Storage", "All data is stored on secure servers (Supabase infrastructure) and is accessible only to authorized company staff."],
      ["4. Your Rights", "You may request deletion or correction of your data at any time by contacting info@abagroup.kz."],
      ["5. Contact", "For questions about this policy, please reach us via the details on the Contact page."],
    ],
  },
};

export default function PrivacyPage() {
  const { lang } = useLang();
  const c = CONTENT[lang];

  return (
    <section className="py-16 px-5 max-w-3xl mx-auto">
      <div className="text-xs font-extrabold uppercase tracking-wide text-blue mb-3">{c.eyebrow}</div>
      <h1 className="font-display text-3xl font-extrabold text-deep-green mb-8">{c.title}</h1>

      <div className="text-ink-soft leading-relaxed flex flex-col gap-5 text-sm">
        {c.sections.map(([heading, body], i) => (
          <div key={i}>
            <h2 className="font-bold text-ink text-base mb-2">{heading}</h2>
            <p>{body}</p>
          </div>
        ))}
        <p className="text-xs text-ink-soft/70 pt-4">{c.updated}</p>
      </div>
    </section>
  );
}
