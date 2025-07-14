const contentData = {
  kontakt: {
    title: "Kontakt",
    sections: [
      {
        type: "paragraph",
        content:
          "Kontaktujte nás na emailu info@firma.cz nebo telefonicky na +420 123 456 789. Naše zákaznická linka je k dispozici od pondělí do pátku, 8:00–18:00.",
      },
      {
        type: "paragraph",
        content:
          "Sídlíme na adrese:\nFirma a.s.\nUlice 123\n110 00 Praha 1\nČeská republika",
      },
      {
        type: "image",
        src: "https://example.com/contact-building.jpg",
        alt: "Naše kanceláře",
      },
      {
        type: "paragraph",
        content:
          "Pro obchodní dotazy kontaktujte obchodní oddělení na obchod@firma.cz.",
      },
    ],
  },
  vraceni: {
    title: "Vrácení zboží",
    sections: [
      {
        type: "paragraph",
        content:
          "Vrácení zboží je možné do 14 dnů od obdržení objednávky, za předpokladu, že je zboží nepoškozené a v původním obalu.",
      },
      {
        type: "list",
        items: [
          "Zboží musí být kompletní a nepoužité.",
          "Vyplňte online formulář pro vrácení, který najdete na našich stránkách.",
          "Zboží zašlete zpět na adresu našeho skladu.",
          "Po přijetí a kontrole zboží vám bude vrácena platba do 14 dnů.",
        ],
      },
      {
        type: "paragraph",
        content:
          "Pokud máte jakékoliv dotazy, obraťte se na naši zákaznickou podporu.",
      },
    ],
  },
  podminky: {
    title: "Obchodní podmínky",
    sections: [
      {
        type: "paragraph",
        content:
          "Níže jsou uvedeny naše obchodní podmínky platné od 1.1.2025. Prosíme všechny zákazníky, aby si je pozorně přečetli před uskutečněním nákupu.",
      },
      {
        type: "paragraph",
        content:
          "1. Reklamace zboží musí být podána do 30 dnů od doručení.\n2. Platební podmínky: akceptujeme platby kartou, bankovním převodem a na dobírku.\n3. Dodací lhůty se mohou lišit v závislosti na skladové dostupnosti.",
      },
      {
        type: "list",
        items: [
          "Reklamace řešíme do 14 dnů od podání.",
          "Zboží lze reklamovat pouze v původním stavu.",
          "Náklady na dopravu při reklamaci hradí firma.",
          "Při platbě předem vám zboží odešleme ihned po připsání platby na účet.",
        ],
      },
      {
        type: "paragraph",
        content:
          "Další podrobnosti najdete v dokumentech ke stažení níže.",
      },
      {
        type: "image",
        src: "https://example.com/terms-doc.png",
        alt: "Obchodní podmínky dokument",
      },
    ],
  },
  faq: {
    title: "Často kladené otázky",
    sections: [
      {
        type: "faq",
        items: [
          {
            question: "Jak objednat?",
            answer:
              "Přidejte zboží do košíku, vyplňte své údaje a potvrďte objednávku. O všem vás budeme informovat emailem.",
          },
          {
            question: "Jak platit?",
            answer:
              "Platbu lze provést kartou, bankovním převodem, nebo na dobírku při převzetí zásilky.",
          },
          {
            question: "Kdy dostanu zboží?",
            answer:
              "Standardní doba dodání je 3-5 pracovních dní, u vybraných položek může být delší.",
          },
          {
            question: "Mohu změnit nebo zrušit objednávku?",
            answer:
              "Ano, do doby expedice objednávky nás můžete kontaktovat a objednávku upravit či zrušit.",
          },
          {
            question: "Jak mohu reklamovat zboží?",
            answer:
              "Reklamace se podávají přes náš online formulář nebo přímo na zákaznickou podporu.",
          },
        ],
      },
    ],
  },
  o_nas: {
    title: "O nás",
    sections: [
      {
        type: "paragraph",
        content:
          "Jsme přední společnost na trhu s více než 20 lety zkušeností v oblasti e-commerce a maloobchodu.",
      },
      {
        type: "paragraph",
        content:
          "Naším cílem je poskytovat kvalitní produkty a vynikající zákaznický servis. Naše hodnoty jsou transparentnost, spolehlivost a inovace.",
      },
      {
        type: "image",
        src: "https://example.com/company-team.jpg",
        alt: "Náš tým",
      },
      {
        type: "list",
        items: [
          "Více než 500 spokojených zákazníků každý den",
          "Expresní doprava po celé ČR",
          "24/7 zákaznická podpora",
          "Ekologicky šetrné balení",
        ],
      },
    ],
  },
  kariera: {
    title: "Kariéra",
    sections: [
      {
        type: "paragraph",
        content:
          "Chcete se připojit k našemu týmu? Hledáme talentované a motivované lidi, kteří chtějí růst s námi.",
      },
      {
        type: "list",
        items: [
          "Pracovní pozice v IT, marketingu, logistice a zákaznickém servisu",
          "Příjemné pracovní prostředí a firemní benefity",
          "Možnost práce na dálku",
          "Školení a rozvoj zaměstnanců",
        ],
      },
      {
        type: "paragraph",
        content:
          "Zašlete nám svůj životopis a motivační dopis na email kariera@firma.cz.",
      },
    ],
  },
};

export default contentData;
