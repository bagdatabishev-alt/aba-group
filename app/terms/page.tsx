"use client";

import { useLang } from "@/lib/i18n/LanguageContext";

const CONTENT = {
  kz: {
    eyebrow: "Заңды ақпарат",
    title: "Қызмет көрсету шарттары",
    intro: "Осы шарттар ABA Group веб-сайтын пайдалану ережелерін белгілейді. Сайтты пайдалану арқылы сіз осы шарттармен келісесіз.",
    updated: "Соңғы жаңартылған күні: 2026 жыл",
    sections: [
      ["1. Тапсырыс беру", "Тапсырыс бергенде сіз дұрыс әрі толық ақпарат беруге міндеттісіз. Компания тапсырысты растау немесе бас тарту құқығын өзінде қалдырады."],
      ["2. Бағалар мен төлем", "Сайттағы барлық бағалар теңгемен көрсетілген және алдын ала ескертусіз өзгеруі мүмкін. Төлем шарттары тапсырысты растау кезінде жеке келісіледі."],
      ["3. Жеткізу", "Жеткізу мерзімі мен құны тауар түріне және жеткізу мекенжайына байланысты өзгереді. Нақты мерзім тапсырысты растау кезінде хабарланады."],
      ["4. Қайтару және айырбастау", "Ақаулы немесе сипаттамаға сай келмейтін тауарды алған жағдайда, сіз тауарды алған күннен бастап 14 күн ішінде қайтару немесе айырбастау туралы өтініш білдіре аласыз."],
      ["5. Жауапкершілік шектеуі", "Компания сайттың үздіксіз әрі қатесіз жұмыс істеуіне кепілдік бермейді, бірақ мүмкіндігінше жылдам ақауларды жоюға тырысады."],
      ["6. Байланыс", "Осы шарттар бойынша сұрақтарыңыз болса, Байланыс бетіндегі деректер арқылы бізге хабарласыңыз."],
    ],
  },
  ru: {
    eyebrow: "Юридическая информация",
    title: "Условия предоставления услуг",
    intro: "Настоящие условия определяют правила использования веб-сайта ABA Group. Используя сайт, вы соглашаетесь с данными условиями.",
    updated: "Последнее обновление: 2026 год",
    sections: [
      ["1. Оформление заказа", "При оформлении заказа вы обязаны предоставить достоверную и полную информацию. Компания оставляет за собой право подтвердить или отклонить заказ."],
      ["2. Цены и оплата", "Все цены на сайте указаны в тенге и могут изменяться без предварительного уведомления. Условия оплаты согласовываются индивидуально при подтверждении заказа."],
      ["3. Доставка", "Сроки и стоимость доставки зависят от типа товара и адреса доставки. Точный срок сообщается при подтверждении заказа."],
      ["4. Возврат и обмен", "В случае получения бракованного товара или товара, не соответствующего описанию, вы можете подать заявку на возврат или обмен в течение 14 дней с момента получения."],
      ["5. Ограничение ответственности", "Компания не гарантирует бесперебойную и безошибочную работу сайта, но стремится максимально быстро устранять неполадки."],
      ["6. Контакты", "По вопросам этих условий свяжитесь с нами через данные на странице Контакты."],
    ],
  },
  en: {
    eyebrow: "Legal Information",
    title: "Terms of Service",
    intro: "These terms establish the rules for using the ABA Group website. By using the site, you agree to these terms.",
    updated: "Last updated: 2026",
    sections: [
      ["1. Placing an Order", "When placing an order, you are required to provide accurate and complete information. The Company reserves the right to confirm or decline any order."],
      ["2. Prices and Payment", "All prices on the site are listed in tenge and may change without prior notice. Payment terms are agreed individually when the order is confirmed."],
      ["3. Delivery", "Delivery time and cost vary depending on the product type and delivery address. The exact timeframe is communicated when the order is confirmed."],
      ["4. Returns and Exchanges", "If you receive a defective product or one that does not match its description, you may request a return or exchange within 14 days of receipt."],
      ["5. Limitation of Liability", "The Company does not guarantee uninterrupted or error-free operation of the website but strives to resolve issues as quickly as possible."],
      ["6. Contact", "For questions about these terms, please reach us via the details on the Contact page."],
    ],
  },
};

export default function TermsPage() {
  const { lang } = useLang();
  const c = CONTENT[lang];

  return (
    <section className="py-16 px-5 max-w-3xl mx-auto">
      <div className="text-xs font-extrabold uppercase tracking-wide text-blue mb-3">{c.eyebrow}</div>
      <h1 className="font-display text-3xl font-extrabold text-deep-green mb-4">{c.title}</h1>
      <p className="text-ink-soft text-sm mb-8">{c.intro}</p>

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
