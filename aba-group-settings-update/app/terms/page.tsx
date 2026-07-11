export const metadata = {
  title: "Terms of Service — ABA Group",
};

export default function TermsPage() {
  return (
    <section className="py-16 px-5 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl font-extrabold text-deep-green mb-8">Қызмет көрсету шарттары</h1>

      <div className="prose prose-sm text-ink-soft leading-relaxed flex flex-col gap-5 text-sm">
        <p>
          Осы шарттар ABA Group веб-сайтын (бұдан әрі — «Сайт») пайдалану ережелерін белгілейді. Сайтты
          пайдалану арқылы сіз осы шарттармен келісесіз.
        </p>

        <div>
          <h2 className="font-bold text-ink text-base mb-2">1. Тапсырыс беру</h2>
          <p>
            Сайт арқылы тапсырыс бергенде сіз дұрыс әрі толық ақпарат беруге міндеттісіз. Компания
            тапсырысты растау немесе бас тарту құқығын өзінде қалдырады.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-ink text-base mb-2">2. Бағалар мен төлем</h2>
          <p>
            Сайттағы барлық бағалар теңгемен көрсетілген және алдын ала ескертусіз өзгеруі мүмкін.
            Төлем шарттары тапсырысты растау кезінде жеке келісіледі.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-ink text-base mb-2">3. Жеткізу</h2>
          <p>
            Жеткізу мерзімі мен құны тауар түріне және жеткізу мекенжайына байланысты өзгереді.
            Нақты мерзім тапсырысты растау кезінде хабарланады.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-ink text-base mb-2">4. Қайтару және айырбастау</h2>
          <p>
            Ақаулы немесе сипаттамаға сай келмейтін тауарды алған жағдайда, сіз тауарды алған күннен
            бастап 14 күн ішінде қайтару немесе айырбастау туралы өтініш білдіре аласыз.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-ink text-base mb-2">5. Жауапкершілік шектеуі</h2>
          <p>
            Компания сайттың үздіксіз әрі қатесіз жұмыс істеуіне кепілдік бермейді, бірақ мүмкіндігінше
            жылдам ақауларды жоюға тырысады.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-ink text-base mb-2">6. Байланыс</h2>
          <p>
            Осы шарттар бойынша сұрақтарыңыз болса, Байланыс бетіндегі деректер арқылы бізге хабарласыңыз.
          </p>
        </div>

        <p className="text-xs text-ink-soft/70 pt-4">Соңғы жаңартылған күні: 2026 жыл</p>
      </div>
    </section>
  );
}
