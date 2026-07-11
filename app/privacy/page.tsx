export const metadata = {
  title: "Privacy Policy — ABA Group",
};

export default function PrivacyPage() {
  return (
    <section className="py-16 px-5 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl font-extrabold text-deep-green mb-8">Құпиялылық саясаты</h1>

      <div className="prose prose-sm text-ink-soft leading-relaxed flex flex-col gap-5 text-sm">
        <p>
          ABA Group (бұдан әрі — «Компания») сіздің жеке деректеріңіздің құпиялылығын сақтауды маңызды деп есептейді.
          Осы саясат сайт арқылы жиналатын ақпараттың қалай пайдаланылатынын түсіндіреді.
        </p>

        <div>
          <h2 className="font-bold text-ink text-base mb-2">1. Жиналатын ақпарат</h2>
          <p>
            Тапсырыс беру немесе байланыс формасын толтыру кезінде біз сіздің атыңызды, телефон нөміріңізді,
            email мекенжайыңызды, жеткізу мекенжайыңызды және тапсырыс мазмұнын жинаймыз.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-ink text-base mb-2">2. Ақпаратты пайдалану мақсаты</h2>
          <p>
            Жиналған деректер тек тапсырысты өңдеу, жеткізуді ұйымдастыру және сізбен байланысу үшін
            қолданылады. Біз сіздің деректеріңізді үшінші тұлғаларға сатпаймыз және жарнама мақсатында
            бөлмейміз.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-ink text-base mb-2">3. Деректерді сақтау</h2>
          <p>
            Барлық деректер қауіпсіз серверлерде (Supabase инфрақұрылымында) сақталады және тек
            авторизацияланған компания қызметкерлеріне қолжетімді.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-ink text-base mb-2">4. Сіздің құқықтарыңыз</h2>
          <p>
            Сіз кез келген уақытта өз деректеріңізді жоюды немесе түзетуді сұрай аласыз. Ол үшін
            info@abagroup.kz мекенжайына хат жіберіңіз.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-ink text-base mb-2">5. Байланыс</h2>
          <p>
            Осы саясат бойынша сұрақтарыңыз болса, Байланыс бетіндегі деректер арқылы бізге хабарласыңыз.
          </p>
        </div>

        <p className="text-xs text-ink-soft/70 pt-4">Соңғы жаңартылған күні: 2026 жыл</p>
      </div>
    </section>
  );
}
