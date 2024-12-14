// src/api/mockData.ts
export const mockData = {
    seznamy: [
      {
        id: 1,
        nazev: "Zelenina na smoothie",
        polozky: [
          { nazev: "Mrkev (na lepší vidění při nočním nakupování)", splneno: false },
          { nazev: "Ten hnusnej špenát co všichni prej milujou", splneno: false },
          { nazev: "Paprika (červená jako moje oči po nočním programování)", splneno: true },
          { nazev: "Rajčata (technicky ovoce, ale psst)", splneno: false },
          { nazev: "Česnek (proti upírským zákazníkům)", splneno: true }
        ],
        archivovano: false,
        members: [
          { id: "1", email: "user@example.com", isOwner: true },
          { id: "2", email: "zdravakamoska@example.com", isOwner: false }
        ]
      },
      {
        id: 2,
        nazev: "Knihy na dovolenou",
        polozky: [
          { nazev: "1984 (pro lepší paranoju na pláži)", splneno: false },
          { nazev: "Malý princ (nikdy nejsi moc starý na pohádku)", splneno: true },
          { nazev: "Pythí a předsudek (programátorská romance)", splneno: false },
          { 
            nazev: "Jak na to: Absurdní vědecké řešení obyčejných každodenních problémů (jako proč ponožky mizí v pračce)", 
            splneno: false 
          },
        ],
        archivovano: false,
        members: [
          { id: "1", email: "user@example.com", isOwner: true },
          { id: "3", email: "knihomol@example.com", isOwner: false },
          { id: "4", email: "plazovylenochal@example.com", isOwner: false }
        ]
      },
      {
        id: 3,
        nazev: "Jezdecké vybavení",
        polozky: [
          { nazev: "Jezdecká helma (důležitější než znalost JavaScriptu)", splneno: false },
          { nazev: "Jezdecké boty (aby noha nevypadala jako po refactoringu)", splneno: true },
          { nazev: "Jezdecké kalhoty (rajtky to nekompilují errorama)", splneno: false },
          { nazev: "Úrazové pojištění (pro případ pádu z vysokého koně)", splneno: false },
          { nazev: "Uzděčka (aby kůň věděl, kdo je senior developer)", splneno: true },
          { nazev: "Čištění na koně (code cleanup kit)", splneno: false },
          { nazev: "Pamlsky pro koně (motivační bonusy)", splneno: true }
        ],
        archivovano: false,
        members: [
          { id: "1", email: "user@example.com", isOwner: true },
          { id: "5", email: "koninadruhoumoc@example.com", isOwner: false }
        ]
      },
      {
        id: 4,
        nazev: "Kempovací vybavení",
        polozky: [
          { nazev: "Stan (přenosná kancelář v přírodě)", splneno: false },
          { nazev: "Spacák (pro nerušený spánek mezi debugováním)", splneno: false },
          { nazev: "Baterka (na noční code reviews)", splneno: true },
          { nazev: "Lékárnička (na ošetření zraněného ega)", splneno: false },
          { nazev: "Pláštěnka na mediťák (ochrana před vodopádem bugů)", splneno: false }
        ],
        archivovano: false,
        members: [
          { id: "1", email: "user@example.com", isOwner: true },
          { id: "6", email: "outdoorprogrammer@example.com", isOwner: false }
        ]
      },
      {
        id: 5,
        nazev: "Starý nákup",
        polozky: [
          { nazev: "Věci co jsem stejně nekoupil", splneno: true },
          { nazev: "Věci co jsem ztratil cestou domů", splneno: true }
        ],
        archivovano: true,
        members: [
          { id: "1", email: "user@example.com", isOwner: true }
        ]
      },
      {
        id: 6,
        nazev: "Prázdný seznam",
        polozky: [],
        archivovano: false,
        members: [{ id: "1", email: "user@example.com", isOwner: true }]
      },
      {
        id: 7,
        nazev: "Seznam s mnoha položkami",
        polozky: Array(50).fill(null).map((_, i) => ({
          nazev: `Položka ${i + 1} (Pro testování dlouhých seznamů a scrollování)`,
          splneno: Math.random() > 0.5
        })),
        archivovano: false,
        members: [{ id: "1", email: "user@example.com", isOwner: true }]
      },
      {
        id: 8,
        nazev: "Seznam s mnoha členy",
        polozky: [{ nazev: "Testovací položka pro více členů", splneno: false }],
        archivovano: false,
        members: Array(10).fill(null).map((_, i) => ({
          id: `member${i}`,
          email: `tester${i}@example.com`,
          isOwner: i === 0
        }))
      },
      {
        id: 9,
        nazev: "Seznam s extrémně dlouhými názvy",
        polozky: [{
          nazev: "Toto je extrémně dlouhý název položky, který by mohl způsobit problémy s layoutem na mobilních zařízeních a měli bychom otestovat, jak se s ním UI vypořádá v různých situacích včetně přetečení textu",
          splneno: false
        }],
        archivovano: false,
        members: [{ id: "1", email: "user@example.com", isOwner: true }]
      },
      {
        id: 10,
        nazev: "Seznam se speciálními znaky @#$%^&*()",
        polozky: [
          { nazev: "Položka s emojis 🎉🎊🎈", splneno: false },
          { nazev: "Položka s HTML znaky <div>test</div>", splneno: false },
          { nazev: "Položka s Unicode znaky ěščřžýáíé", splneno: true }
        ],
        archivovano: false,
        members: [{ id: "1", email: "user@example.com", isOwner: true }]
      },
      {
        id: 11,
        nazev: "Seznam s duplicate items",
        polozky: [
          { nazev: "Stejná položka", splneno: false },
          { nazev: "Stejná položka", splneno: true },
          { nazev: "Stejná položka", splneno: false }
        ],
        archivovano: false,
        members: [{ id: "1", email: "user@example.com", isOwner: true }]
      },
      {
        id: 12,
        nazev: "Seznam bez vlastníka",
        polozky: [{ nazev: "Test položka", splneno: false }],
        archivovano: false,
        members: [
          { id: "7", email: "member1@example.com", isOwner: false },
          { id: "8", email: "member2@example.com", isOwner: false }
        ]
      }
    ]
  };