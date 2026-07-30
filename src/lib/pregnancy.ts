export interface WeeklyInfo {
  week: number;
  trimester: 1 | 2 | 3;
  title: string;
  subtitle: string;
  babyName: string;
  babyIcon: string;
  babyLength: string;
  babyWeight: string;
  babyDesc: string;
  momDesc: string;
  tips: string[];
  symptoms: string[];
  symptomsNote: string;
  endMessage: string;
}

export const QUOTES = [
  "Prends le temps de respirer, tu fais déjà un travail extraordinaire.",
  "Aie confiance en ton corps et en ton instinct maternel.",
  "Chaque jour qui passe rapproche ton cœur de celui de ton bébé.",
  "Écoute ton besoin de repos sans aucune culpabilité.",
  "Tu es forte, aimante et parfaitement adaptée à cette aventure.",
  "Laisse la douceur envahir tes pensées aujourd'hui.",
  "Un pas après l'autre, avec toute la tendresse que tu mérites."
];

// Complete 40-week maternal health data for MamanZen
export const WEEKLY_DATA: Record<number, WeeklyInfo> = {
  1: {
    week: 1,
    trimester: 1,
    title: "Semaine 1",
    subtitle: "Le tout premier pas du chemin",
    babyName: "Une étincelle de vie",
    babyIcon: "✨",
    babyLength: "Microscopique",
    babyWeight: "< 0.1 g",
    babyDesc: "Ton corps se prépare discrètement. La magie de la vie commence dans le secret absolu de tes cellules.",
    momDesc: "C'est théoriquement le début du cycle. Ton corps prépare naturellement un ovule dans une douceur infinie.",
    tips: [
      "Commence à prendre de l'acide folique si ce n'est pas déjà fait",
      "Accordé-toi des nuits de sommeil bien réparatrices",
      "Maintiens une hydratation douce tout au long de la journée"
    ],
    symptoms: ["Légers tiraillements habituels", "Petite fatigue de fin de cycle"],
    symptomsNote: "Ton corps commence à modifier son équilibre à son propre rythme.",
    endMessage: "Bienvenue au tout début d'une merveilleuse aventure. Prends soin de toi."
  },
  2: {
    week: 2,
    trimester: 1,
    title: "Semaine 2",
    subtitle: "La préparation du nid",
    babyName: "Graine de vie",
    babyIcon: "🌸",
    babyLength: "Microscopique",
    babyWeight: "< 0.1 g",
    babyDesc: "La rencontre féconde a lieu ou s'apprête à avoir lieu. Une cellule unique contient déjà tout le patrimoine.",
    momDesc: "L'ovulation a lieu. Ton utérus prépare une muqueuse douillette pour accueillir ce futur petit être.",
    tips: [
      "Évite le stress inutile et prends des moments pour toi",
      "Privilégie une alimentation fraîche et colorée",
      "Pratique des respirations douces en fin de journée"
    ],
    symptoms: ["Légère sensibilité pelvienne", "Vitalité changeante"],
    symptomsNote: "Tout se met en place naturellement, fais confiance aux ressources de ton corps.",
    endMessage: "Laisse les choses se faire avec sérénité."
  },
  3: {
    week: 3,
    trimester: 1,
    title: "Semaine 3",
    subtitle: "L'implantation délicate",
    babyName: "Tête de pin-pon",
    babyIcon: "🌱",
    babyLength: "0.1 mm",
    babyWeight: "< 0.1 g",
    babyDesc: "L'œuf voyage calmement vers l'utérus et commence à s'y faire une petite place au chaud.",
    momDesc: "Des signaux hormonaux subtils commencent à circuler. Tu peux ressentir une intuition ou une sensibilité particulière.",
    tips: [
      "Écoute ton corps si tu ressens le besoin de ralentir",
      "Continue à t'hydrater abondamment avec de l'eau claire",
      "Évite l'alcool et le tabac en toute bienveillance"
    ],
    symptoms: ["Légères pertes rosées possibles", "Seins légèrement sensibles"],
    symptomsNote: "Ces petits signes témoignent du travail de nidification de ton utérus.",
    endMessage: "Chaque jour est une étape douce franchie."
  },
  4: {
    week: 4,
    trimester: 1,
    title: "Semaine 4",
    subtitle: "L'aventure est lancée",
    babyName: "Graine de pavot",
    babyIcon: "🌾",
    babyLength: "1 mm",
    babyWeight: "< 1 g",
    babyDesc: "L'embryon s'installe confortablement. Les trois premiers feuillets embryonnaires commencent à se différencier.",
    momDesc: "La sécrétion d'hCG augmente rapidement. C'est souvent le moment du test positif ou du retard de règles.",
    tips: [
      "Accueille la nouvelle avec émotion, à ton propre rythme",
      "Prends rendez-vous pour ton premier bilan avec ta sage-femme",
      "Prends le temps de poser tes ressentis par écrit si tu aimes écrire"
    ],
    symptoms: ["Retard de règles", "Fatigue soudaine", "Seins tendus"],
    symptomsNote: "C'est le début des grandes vagues hormonales. C'est tout à fait normal.",
    endMessage: "Félicitations pour ce merveilleux départ !"
  },
  5: {
    week: 5,
    trimester: 1,
    title: "Semaine 5",
    subtitle: "Le cœur qui s'éveille",
    babyName: "Graine de sésame",
    babyIcon: "🌱",
    babyLength: "2 mm",
    babyWeight: "< 1 g",
    babyDesc: "Un minuscule tube cardiaque commence à battre d'un rythme régulier et puissant.",
    momDesc: "Les hormones battent leur plein. Tu peux te sentir barbouillée ou avoir envie de faire des siestes.",
    tips: [
      "Fractionne tes repas en 5 petites collations douces",
      "Garde une bouteille d'eau et des biscottes à portée de main",
      "Repose-toi sans te justifier"
    ],
    symptoms: ["Nausées matinales", "Fatigue marquée", "Hypersensibilité olfactive"],
    symptomsNote: "Ces désagréments témoignent de l'activité intense de ton placenta en formation.",
    endMessage: "Avance une heure après l'autre, avec beaucoup de douceur."
  },
  6: {
    week: 6,
    trimester: 1,
    title: "Semaine 6",
    subtitle: "Les contours de la vie",
    babyName: "Lentille",
    babyIcon: "🫘",
    babyLength: "4 mm",
    babyWeight: "< 1 g",
    babyDesc: "Les ébauches des yeux, des oreilles et du nez apparaissent. Les bourgeons des membres se dessinent.",
    momDesc: "L'utérus grandit doucement. Ton métabolisme s'adapte pour nourrir ce développement intense.",
    tips: [
      "Privilégie les aliments faciles à digérer qui te font envie",
      "Évite les odeurs fortes qui t'incommodent",
      "Marche 15 minutes à l'air libre si tu en as la force"
    ],
    symptoms: ["Nausées", "Somnolence", "Envie fréquente d'uriner"],
    symptomsNote: "L'afflux sanguin dans le bassin s'intensifie, ce qui stimule la vessie.",
    endMessage: "Écoute tes besoins sans culpabilité."
  },
  7: {
    week: 7,
    trimester: 1,
    title: "Semaine 7",
    subtitle: "Des petits mouvements secrets",
    babyName: "Myrtille",
    babyIcon: "🫐",
    babyLength: "10 mm",
    babyWeight: "1 g",
    babyDesc: "Bébé commence de minuscules mouvements réflexes, encore imperceptibles pour toi.",
    momDesc: "Les émotions peuvent fluctuer. Un mélange de joie, d'impatience et parfois de doutes est fréquent.",
    tips: [
      "Partage tes ressentis avec ton/ta partenaire ou une amie proche",
      "Consomme des aliments riches en magnésium (amandes, céréales complètes)",
      "Accorde-toi des moments de méditation guidée dans l'application"
    ],
    symptoms: ["Sautes d'humeur", "Nausées", "Tiraillements au bas-ventre"],
    symptomsNote: "Les ligaments utérins s'étirent délicatement pour faire de la place.",
    endMessage: "Tes émotions sont toutes légitimes. Laisse-les traverser sereinement."
  },
  8: {
    week: 8,
    trimester: 1,
    title: "Semaine 8",
    subtitle: "Les fondations se mettent en place",
    babyName: "Framboise",
    babyIcon: "🫐",
    babyLength: "1.6 cm",
    babyWeight: "1.5 g",
    babyDesc: "Son cœur bat déjà bien plus vite que le tien, et ses petits bras et jambes commencent à se former. Même s'il est encore tout petit, beaucoup de choses importantes se construisent en ce moment.",
    momDesc: "Tu peux ressentir une grande fatigue, des nausées, une poitrine sensible ou des émotions qui montent facilement. Ton corps travaille énormément, même si ça ne se voit pas encore beaucoup. C'est normal d'avoir besoin de plus de repos que d'habitude.",
    tips: [
      "Repose-toi dès que tu en ressens le besoin, sans culpabiliser",
      "Mange en petites quantités et plus souvent si tu as des nausées",
      "Hydrate-toi régulièrement, même par petites gorgées",
      "Note ce que tu ressens dans ton suivi, ça t'aidera à mieux te connaître"
    ],
    symptoms: ["Nausées", "Fatigue intense", "Seins sensibles", "Envie fréquente d'uriner", "Changements d'humeur"],
    symptomsNote: "Ces sensations sont très courantes à cette période et s'atténuent souvent progressivement.",
    endMessage: "Tu traverses une période intense. Avance doucement, une journée à la fois."
  },
  9: {
    week: 9,
    trimester: 1,
    title: "Semaine 9",
    subtitle: "De l'embryon au fœtus",
    babyName: "Cerise",
    babyIcon: "🍒",
    babyLength: "2.3 cm",
    babyWeight: "2 g",
    babyDesc: "Officiellement, bébé devient un fœtus ! Ses articulations (coudes, poignets) fonctionnent désormais.",
    momDesc: "Ton volume sanguin commence à augmenter. Tu peux avoir un peu plus chaud ou te sentir essoufflée plus vite.",
    tips: [
      "Mets des vêtements souples sans compression sur le ventre",
      "Bois des infusions douces (camomille, verveine)",
      "Repose tes jambes en les surélevant le soir"
    ],
    symptoms: ["Tension mammaire", "Ballonnements", "Légers vertiges au lever"],
    symptomsNote: "Prends le temps de te lever doucement pour laisser ta tension s'adapter.",
    endMessage: "Ton corps orchestre un vrai chef-d'œuvre."
  },
  10: {
    week: 10,
    trimester: 1,
    title: "Semaine 10",
    subtitle: "Les détails du visage",
    babyName: "Fraise",
    babyIcon: "🍓",
    babyLength: "3.1 cm",
    babyWeight: "4 g",
    babyDesc: "Les paupières se ferment pour protéger les yeux. Bébé commence à avaler du liquide amniotique.",
    momDesc: "La taille de ton utérus correspond maintenant à celle d'une orange. Les nausées atteignent parfois leur pic avant de diminuer.",
    tips: [
      "Planifie ton échographie du 1er trimestre si ce n'est pas fait",
      "Continue les promenades douces à ton rythme",
      "Applique une huile neutre et hydratante sur ta peau"
    ],
    symptoms: ["Fatigue encore présente", "Digestion ralentie", "Gencives plus sensibles"],
    symptomsNote: "Utilise une brosse à dents souple pour préserver tes gencives.",
    endMessage: "Le cap des 10 semaines est une très belle étape franchie."
  },
  11: {
    week: 11,
    trimester: 1,
    title: "Semaine 11",
    subtitle: "Une croissance fulgurante",
    babyName: "Figue",
    babyIcon: "🫒",
    babyLength: "4.1 cm",
    babyWeight: "7 g",
    babyDesc: "Bébé bouge avec énergie ! Ses ongles se développent et ses follicules pileux apparaissent.",
    momDesc: "L'horizon du deuxième trimestre approche. Tu constateras bientôt un beau regain d'énergie.",
    tips: [
      "Incorpore des fibres douces dans ton alimentation (pruneaux, compotes)",
      "Prends le temps de lire des guides bienveillants",
      "Prépare tes questions pour la prochaine consultation"
    ],
    symptoms: ["Constipation passagère", "Légère diminution des nausées", "Peau plus lumineuse"],
    symptomsNote: "Les hormones stabilisent progressivement leur plateau.",
    endMessage: "La fin du premier trimestre se profile avec douceur."
  },
  12: {
    week: 12,
    trimester: 1,
    title: "Semaine 12",
    subtitle: "La grande première rencontre",
    babyName: "Prune",
    babyIcon: "🫐",
    babyLength: "5.4 cm",
    babyWeight: "14 g",
    babyDesc: "Tous ses organes vitaux sont formés. Il ne lui reste plus qu'à grandir et mûrir au chaud.",
    momDesc: "C'est généralement la semaine de la première échographie officielle. Une émotion souvent inoubliable.",
    tips: [
      "Savoure le moment de l'échographie sans stress",
      "Profite du retour progressif de ton appétit",
      "Masse doucement ton bas-ventre avec une huile naturelle"
    ],
    symptoms: ["Nausées en baisse", "Regain de vitalité", "Envie de partager la nouvelle"],
    symptomsNote: "Le placenta prend pleinement le relais de la production hormonale.",
    endMessage: "Félicitations pour ce premier trimestre accompli !"
  },
  13: {
    week: 13,
    trimester: 2,
    title: "Semaine 13",
    subtitle: "L'aube du 2ème trimestre",
    babyName: "Citron vert",
    babyIcon: "🍋",
    babyLength: "7.4 cm",
    babyWeight: "23 g",
    babyDesc: "Ses empreintes digitales uniques sont désormais gravées sur ses petits doigts.",
    momDesc: "Bienvenue dans le 2e trimestre ! Pour beaucoup de femmes, c'est la période la plus sereine et épanouissante.",
    tips: [
      "Profite de ce regain d'énergie pour faire des activités plaisantes",
      "Commence une activité douce comme le yoga prénatal",
      "Remplace tes pantalons serrés par des vêtements de maternité confortables"
    ],
    symptoms: ["Forme retrouvée", "Ventre qui commence à se dessiner", "Libido en hausse possible"],
    symptomsNote: "Le deuxième trimestre apporte souvent une belle harmonie physique.",
    endMessage: "Profite pleinement de cette nouvelle clarté."
  },
  14: {
    week: 14,
    trimester: 2,
    title: "Semaine 14",
    subtitle: "Expressions & sourires",
    babyName: "Pêche",
    babyIcon: "🍑",
    babyLength: "8.7 cm",
    babyWeight: "43 g",
    babyDesc: "Bébé fait des grimaces, suce son pouce et s'entraîne à respirer avec le liquide amniotique.",
    momDesc: "Ton utérus remonte dans la cavité abdominale, soulageant un peu la pression sur ta vessie.",
    tips: [
      "Adopte une posture bien droite pour éviter les tiraillements de dos",
      "Reprends des repas équilibrés avec plaisir",
      "Prends des photos de ton ventre pour garder un doux souvenir"
    ],
    symptoms: ["Aptitudes digestives améliorées", "Légers tiraillements ligamentaires"],
    symptomsNote: "L'utérus grandit vers le haut, ce qui dégage le bassin.",
    endMessage: "Tu rayonnes de cette nouvelle énergie."
  },
  15: {
    week: 15,
    trimester: 2,
    title: "Semaine 15",
    subtitle: "Sensibilité aux sons",
    babyName: "Pomme",
    babyIcon: "🍎",
    babyLength: "10 cm",
    babyWeight: "70 g",
    babyDesc: "Ses oreilles sont en place. Bébé perçoit les battements de ton cœur et le grondement doux de ta digestion.",
    momDesc: "Ton teint est souvent éclatant grâce à l'augmentation de la circulation sanguine.",
    tips: [
      "Mets de la musique apaisante que tu aimes",
      "Pense à bien étirer tes mollets pour éviter les crampes nocturnes",
      "Achète ton premier soutien-gorge de grossesse bien emboîtant"
    ],
    symptoms: ["Nez parfois bouché (rhinite de grossesse)", "Peau lumineuse", "Crampes occasionnelles"],
    symptomsNote: "Les muqueuses sont plus vascularisées, ce qui est tout à fait bénin.",
    endMessage: "Écoute les rythmes paisibles de ton corps."
  },
  16: {
    week: 16,
    trimester: 2,
    title: "Semaine 16",
    subtitle: "Un petit jardin secret",
    babyName: "Avocat",
    babyIcon: "🥑",
    babyLength: "11.6 cm",
    babyWeight: "100 g",
    babyDesc: "Bébé tient sa tête bien droite. Ses yeux font de petits mouvements lents sous les paupières.",
    momDesc: "Certaines mamans ressentent de petits effleurements, comme des ailes de papillon dans le ventre.",
    tips: [
      "Pose tes mains sur ton bas-ventre dans le calme du soir",
      "Marche régulièrement à ton rythme",
      "Maintiens un bon apport en calcium (produits laitiers ou eaux enrichies)"
    ],
    symptoms: ["Sensation de bulles ou papillons", "Appétit stimulé", "Maux de dos légers"],
    symptomsNote: "Ces premières sensations sont magiques et uniques à chaque femme.",
    endMessage: "Un dialogue silencieux s'installe entre bébé et toi."
  },
  17: {
    week: 17,
    trimester: 2,
    title: "Semaine 17",
    subtitle: "Le tissu adipeux se forme",
    babyName: "Poire",
    babyIcon: "🍐",
    babyLength: "13 cm",
    babyWeight: "140 g",
    babyDesc: "Bébé commence à constituer sa réserve de graisse pour maintenir sa température future.",
    momDesc: "Ton centre de gravité commence à se déplacer légèrement vers l'avant.",
    tips: [
      "Porte des chaussures souples et stables avec de petits talons",
      "Évite de porter des charges lourdes",
      "Prends des bains tièdes ou douches relaxantes"
    ],
    symptoms: ["Légers déséquilibres", "Transpiration plus abondante", "Sommeil agréable"],
    symptomsNote: "Ton corps s'adapte à la nouvelle répartition du poids.",
    endMessage: "Chaque semaine renforce votre complicité."
  },
  18: {
    week: 18,
    trimester: 2,
    title: "Semaine 18",
    subtitle: "Les mouvements s'affirment",
    babyName: "Patate douce",
    babyIcon: "🍠",
    babyLength: "14.2 cm",
    babyWeight: "190 g",
    babyDesc: "La myéline commence à gainer les nerfs de bébé. Ses mouvements deviennent plus coordonnés et vigoureux.",
    momDesc: "Si tu n'as pas encore senti bébé bouger, cela ne saurait tarder ! C'est le moment privilégié pour se poser.",
    tips: [
      "Allonge-toi sur le côté gauche pour favoriser une bonne circulation",
      "Pratique des exercices du périnée en douceur",
      "Commence à réfléchir à ton projet de naissance si tu le souhaites"
    ],
    symptoms: ["Coup de pied léger", "Tension artérielle basse", "Démangeaisons légères du ventre"],
    symptomsNote: "Hydrate bien ton ventre pour apaiser les démangeaisons d'étirement.",
    endMessage: "Ton instinct s'épanouit jour après jour."
  },
  19: {
    week: 19,
    trimester: 2,
    title: "Semaine 19",
    subtitle: "Le vernix caseosa",
    babyName: "Grenade",
    babyIcon: "🍎",
    babyLength: "15.3 cm",
    babyWeight: "240 g",
    babyDesc: "Une substance crémeuse et protectrice (le vernix) recouvre la peau de bébé pour la protéger dans le liquide.",
    momDesc: "Tu peux constater de petites taches pigmentaires (chloasma ou masque de grossesse).",
    tips: [
      "Protège ton visage du soleil avec une crème indice 50",
      "Brais et mange des légumes riches en fer (lentilles, épinards)",
      "Partage des moments de complicité avec ton entourage"
    ],
    symptoms: ["Masque de grossesse possible", "Mouvements nets de bébé", "Petite essoufflement"],
    symptomsNote: "L'hyperpigmentation s'estompera naturellement après la naissance.",
    endMessage: "Tu es le cocon parfait pour ton enfant."
  },
  20: {
    week: 20,
    trimester: 2,
    title: "Semaine 20",
    subtitle: "Tu es à mi-chemin",
    babyName: "Banane",
    babyIcon: "🍌",
    babyLength: "25 cm",
    babyWeight: "300 g",
    babyDesc: "Bébé s'agite de plus en plus, et tu peux commencer à sentir ses mouvements (de petites bulles, des petits coups discrets). Ses sens se développent, et il commence à percevoir les sons de l'extérieur.",
    momDesc: "Beaucoup de femmes se sentent un peu mieux à cette période : plus d'énergie, un ventre qui s'arrondit, et parfois une vraie connexion qui s'installe avec bébé. Tu peux aussi ressentir des tiraillements, des maux de dos légers ou besoin de plus d'espace dans tes vêtements.",
    tips: [
      "Prends le temps de parler ou de chanter à bébé, même simplement",
      "Bouge doucement chaque jour (marche, étirements)",
      "Commence à noter les questions que tu veux poser à ta prochaine consultation",
      "Profite de ce moment pour faire des choses qui te font du bien"
    ],
    symptoms: ["Mouvements de bébé", "Tiraillements du ventre", "Maux de dos légers", "Essoufflement léger", "Envie plus fréquente d'uriner"],
    symptomsNote: "La plupart de ces sensations font partie du chemin normal de la grossesse.",
    endMessage: "Tu es déjà à mi-parcours. Prends un moment pour reconnaître tout ce que tu as déjà traversé."
  },
  21: {
    week: 21,
    trimester: 2,
    title: "Semaine 21",
    subtitle: "Le goût s'éveille",
    babyName: "Carotte",
    babyIcon: "🥕",
    babyLength: "26.7 cm",
    babyWeight: "360 g",
    babyDesc: "Ses papilles gustatives sont fonctionnelles. Bébé goûte les nuances du liquide amniotique selon ce que tu manges.",
    momDesc: "Ton utérus dépasse maintenant le niveau du nombril. Les mouvements sont réguliers.",
    tips: [
      "Varie tes repas pour faire découvrir de nouvelles saveurs à bébé",
      "Offre-toi des massages de pieds très doux",
      "Garde des postures confortables au travail"
    ],
    symptoms: ["Appétit constant", "Rides de grossesse naissantes", "Varicosités légères"],
    symptomsNote: "Des bas de contention peuvent grandement soulager tes jambes si besoin.",
    endMessage: "Vous partagez déjà vos premiers repères culinaires !"
  },
  22: {
    week: 22,
    trimester: 2,
    title: "Semaine 22",
    subtitle: "Le toucher & les caresses",
    babyName: "Courgette",
    babyIcon: "🥒",
    babyLength: "27.8 cm",
    babyWeight: "430 g",
    babyDesc: "Bébé explore son environnement avec ses mains : il touche son visage, attrape le cordon ombilical.",
    momDesc: "Ton ventre est magnifiquement rond. Les gens commencent à le remarquer spontanément.",
    tips: [
      "Masses ton ventre en faisant de doux cercles avec une huile bio",
      "Prends le temps de vous reposer en duo",
      "N'hésite pas à poser tes questions à ta sage-femme"
    ],
    symptoms: ["Contractions de Braxton Hicks très occasionnelles", "Maux de dos", "Envie de cocon"],
    symptomsNote: "Ces contractions non douloureuses entraînent simplement ton utérus.",
    endMessage: "Ton cocon est un havre de paix et de sécurité."
  },
  23: {
    week: 23,
    trimester: 2,
    title: "Semaine 23",
    subtitle: "Le sommeil de bébé",
    babyName: "Aubergine",
    babyIcon: "🍆",
    babyLength: "28.9 cm",
    babyWeight: "500 g",
    babyDesc: "Bébé alterne des phases de sommeil profond et d'éveil actif. Il peut même avoir le hoquet !",
    momDesc: "Tu peux sentir de petites secousses très régulières dans le ventre : c'est bébé qui a le hoquet.",
    tips: [
      "Souris quand tu sens son hoquet, c'est le signe que son diaphragme travaille",
      "Repose-toi pendant ses moments de calme",
      "Maintiens un apport suffisant en fer"
    ],
    symptoms: ["Petit hoquet de bébé ressentis", "Pieds légèrement enflés le soir", "Sommeil agréable"],
    symptomsNote: "Le hoquet du fœtus est un phénomène tout à fait naturel et bénin.",
    endMessage: "Chaque petit sursaut est un clin d'œil de la vie."
  },
  24: {
    week: 24,
    trimester: 2,
    title: "Semaine 24",
    subtitle: "Un souffle de viabilité",
    babyName: "Épi de maïs",
    babyIcon: "🌽",
    babyLength: "30 cm",
    babyWeight: "600 g",
    babyDesc: "Ses poumons produisent le surfactant, une substance essentielle pour l'ouverture des alvéoles à la naissance.",
    momDesc: "C'est une étape symbolique importante dans le développement fœtal.",
    tips: [
      "Surélève tes pieds sur un coussin le soir",
      "Inscris-toi aux cours de préparation à la naissance",
      "Prends du temps pour lire ou écouter de la musique douce"
    ],
    symptoms: ["Reflux gastriques possibles", "Lourdeur des jambes", "Peau du ventre tendue"],
    symptomsNote: "Évite de t'allonger immédiatement après les repas pour réduire le reflux.",
    endMessage: "Une étape franchie avec force et sérénité."
  },
  25: {
    week: 25,
    trimester: 2,
    title: "Semaine 25",
    subtitle: "La voix des proches",
    babyName: "Chou-fleur",
    babyIcon: "🥦",
    babyLength: "34.6 cm",
    babyWeight: "660 g",
    babyDesc: "Bébé reconnaît parfaitement la voix de sa maman et celle du co-parent. Ses cheveux prennent leur couleur.",
    momDesc: "Ton utérus a la taille d'un ballon de football. Tu peux ressentir une pression sous les côtes.",
    tips: [
      "Encourage ton/ta partenaire à parler tout près du ventre",
      "Pratique des étirements latéraux doux",
      "Consomme des aliments riches en oméga 3 (noix, huiles végétales)"
    ],
    symptoms: ["Pression sous-costale", "Mouvements vigoureux", "Sécheresse cutanée"],
    symptomsNote: "C'est le moment idéal pour chouchouter ta peau avec des baumes nourrisseurs.",
    endMessage: "Bébé écoute déjà le monde avec tendresse."
  },
  26: {
    week: 26,
    trimester: 2,
    title: "Semaine 26",
    subtitle: "Les yeux s'ouvrent",
    babyName: "Laitue romaine",
    babyIcon: "🥬",
    babyLength: "35.6 cm",
    babyWeight: "760 g",
    babyDesc: "Ses paupières s'ouvrent enfin ! Ses yeux sont bleus ou gris pour l'instant et réagissent à la lumière intense.",
    momDesc: "Le volume de liquide amniotique est à son niveau maximal. Bébé a encore de la place pour faire des pirouettes.",
    tips: [
      "Prépare un coin douillet chez toi pour te détendre",
      "Bois des tisanes adaptées conseillées par ta sage-femme",
      "Consulte nos checklists pour la chambre de bébé"
    ],
    symptoms: ["Maux de dos occasionnels", "Crampes nocturnes", "Envies fréquentes d'uriner"],
    symptomsNote: "Assure-toi d'un bon apport en magnésium et en eau pour éviter les crampes.",
    endMessage: "Ses yeux s'ouvrent sur ton univers bienveillant."
  },
  27: {
    week: 27,
    trimester: 2,
    title: "Semaine 27",
    subtitle: "Cap sur le 3ème trimestre",
    babyName: "Chou rutabaga",
    babyIcon: "🍠",
    babyLength: "36.6 cm",
    babyWeight: "875 g",
    babyDesc: "Son cerveau développe un réseau complexe de circonvolutions. Bébé rêve durant ses phases de sommeil.",
    momDesc: "Dernière semaine du 2e trimestre ! Un beau parcours déjà accompli.",
    tips: [
      "Félicite-toi pour tout ce chemin parcouru",
      "Adopte le coussin de maternité pour cale ton dos la nuit",
      "Maintenez une activité douce et régulière"
    ],
    symptoms: ["Essoufflement au repos", "Sommeil plus léger", "Petites contractions physiologiques"],
    symptomsNote: "Le coussin de grossesse devient ton meilleur allié pour la nuit.",
    endMessage: "Bravo pour cette magnifique fin de 2e trimestre !"
  },
  28: {
    week: 28,
    trimester: 3,
    title: "Semaine 28",
    subtitle: "L'entrée dans la dernière ligne droite",
    babyName: "Aubergine géante",
    babyIcon: "🍆",
    babyLength: "37.6 cm",
    babyWeight: "1 kg",
    babyDesc: "Bébé franchit la barre symbolique du kilo ! Il distingue clairement la lumière filtrant à travers ton ventre.",
    momDesc: "Bienvenue dans le 3e trimestre. La fatigue peut revenir progressivement, écoute ton rythme.",
    tips: [
      "Accorde-toi au moins une sieste ou pause allongée par jour",
      "Pratique des respirations abdominales profondes",
      "Prépare le bilan du 3e trimestre avec ton équipe médicale"
    ],
    symptoms: ["Fatigue de retour", "Lourdeur abdominale", "Reflux gastrique"],
    symptomsNote: "L'utérus pousse doucement sur l'estomac, ce qui ralentit la digestion.",
    endMessage: "La rencontre se rapproche doucement. Prends soin de toi."
  },
  29: {
    week: 29,
    trimester: 3,
    title: "Semaine 29",
    subtitle: "Muscles & calcium",
    babyName: "Butternut",
    babyIcon: "🎃",
    babyLength: "38.6 cm",
    babyWeight: "1.15 kg",
    babyDesc: "Ses os fixent activement le calcium. Ses muscles prennent de la force, ce qui rend ses coups plus affirmés.",
    momDesc: "Tu peux sentir des mouvements très nets et localized sous tes côtes ou dans le bas-ventre.",
    tips: [
      "Veille à consommer suffisamment de calcium et vitamine D",
      "Repose-toi dès que le besoin s'en fait sentir",
      "Prends des bains de pieds tièdes au sel d'Epsom"
    ],
    symptoms: ["Coups vigoureux", "Tension dans le bas du dos", "Envie de nidification"],
    symptomsNote: "L'instinct de préparation du foyer apparaît naturellement.",
    endMessage: "Chaque coup de pied est une marque de vitalité."
  },
  30: {
    week: 30,
    trimester: 3,
    title: "Semaine 30",
    subtitle: "L'espace qui se réduit",
    babyName: "Chou vert",
    babyIcon: "🥬",
    babyLength: "39.9 cm",
    babyWeight: "1.3 kg",
    babyDesc: "Bébé commence à se replier en position fœtale. Il a moins de place pour sauter, mais se retourne souvent.",
    momDesc: "Tu peux ressentir de petites douleurs ligamentaires au niveau du bassin qui se prépare à s'ouvrir.",
    tips: [
      "Utilise un ballon de gymnastique (Swiss ball) pour bercer ton bassin",
      "Dors sur le côté gauche avec un oreiller entre les genoux",
      "Fais des pauses régulières pendant tes journées"
    ],
    symptoms: ["Inconforts pelviens", "Sommeil haché", "Contractions indolores"],
    symptomsNote: "Le Swiss ball permet de détendre le bas du dos en douceur.",
    endMessage: "Tu prépares ton corps avec une grande sagesse."
  },
  31: {
    week: 31,
    trimester: 3,
    title: "Semaine 31",
    subtitle: "Maturation des sens",
    babyName: "Ananas",
    babyIcon: "🍍",
    babyLength: "41.1 cm",
    babyWeight: "1.5 kg",
    babyDesc: "Tous ses sens sont maintenant opérationnels. Bébé perçoit la lumière, les sons, le goût et le toucher.",
    momDesc: "Du colostrum (le premier lait très riche) peut parfois s'écouler discrètement de tes seins.",
    tips: [
      "Place de petites compresses douces dans ton soutien-gorge si besoin",
      "Continue à t'hydrater la peau généreusement",
      "Commence à préparer la valise de maternité sans pression"
    ],
    symptoms: ["Écoulement de colostrum possible", "Essoufflement au moindre effort", "Pieds gonflés"],
    symptomsNote: "Le colostrum est le signe que tes seins se préparent parfaitement.",
    endMessage: "Ton corps sait exactement ce qu'il fait."
  },
  32: {
    week: 32,
    trimester: 3,
    title: "Semaine 32",
    subtitle: "L'ébauche de la position finale",
    babyName: "Courge butternut",
    babyIcon: "🎃",
    babyLength: "42.4 cm",
    babyWeight: "1.7 kg",
    babyDesc: "La plupart des bébés se mettent la tête en bas vers cette période pour se préparer à la sortie.",
    momDesc: "C'est souvent l'heure de la troisième et dernière échographie obligatoire !",
    tips: [
      "Profite des images rassurantes de l'échographie du 3e trimestre",
      "Finalise les achats essentiels pour le retour à la maison",
      "Accordé-toi des moments de relaxation guidée"
    ],
    symptoms: ["Pression sur le bassin", "Troisième échographie", "Fatigue récurrente"],
    symptomsNote: "Si bébé est encore en siège, il a encore le temps de se retourner.",
    endMessage: "Chaque détail se met en place naturellement."
  },
  33: {
    week: 33,
    trimester: 3,
    title: "Semaine 33",
    subtitle: "L'immunité partagée",
    babyName: "Céleri-rave",
    babyIcon: "🥔",
    babyLength: "43.7 cm",
    babyWeight: "1.9 kg",
    babyDesc: "Tu lui transmets tes anticorps à travers le placenta, lui constituant son tout premier bouclier immunitaire.",
    momDesc: "Le volume de liquide amniotique commence à se stabiliser puis diminuera légèrement pour laisser la place à bébé.",
    tips: [
      "Repose-toi autant que possible pendant la journée",
      "Prépare quelques plats congelés pour tes premiers jours de post-partum",
      "Détends tes épaules et ta mâchoire régulièrement"
    ],
    symptoms: ["Contractions de Braxton Hicks plus fréquentes", "Brûlures d'estomac", "Lourdeur générale"],
    symptomsNote: "Un verre de lait tiède ou une poignée d'amandes peut apaiser les brûlures.",
    endMessage: "Tu lui offres le plus beau des boucliers protecteurs."
  },
  34: {
    week: 34,
    trimester: 3,
    title: "Semaine 34",
    subtitle: "La dernière ligne droite s'approche",
    babyName: "Melon cantaloup",
    babyIcon: "🍈",
    babyLength: "45 cm",
    babyWeight: "2.1 kg",
    babyDesc: "Il prend du poids, ses poumons continuent de mûrir, et il a de moins en moins de place pour bouger. Ses mouvements peuvent sembler différents : plus amples, plus puissants, parfois plus rares mais bien présents.",
    momDesc: "La fatigue peut revenir, le sommeil être plus fragmenté, et ton corps plus lourd. Tu peux ressentir des contractions d'entraînement (Braxton Hicks), des difficultés à trouver une position confortable, ou une envie grandissante de « préparer le nid ».",
    tips: [
      "Repose-toi dès que possible, même 15 minutes allongée sur le côté",
      "Prépare progressivement ta valise de maternité sans pression",
      "Continue à noter les mouvements de bébé de façon détendue",
      "Parle de tes besoins à ton entourage, tu n'as pas à tout porter seule"
    ],
    symptoms: ["Fatigue", "Difficultés à dormir", "Contractions d'entraînement", "Reflux", "Maux de dos", "Envie fréquente d'uriner", "Œdèmes légers"],
    symptomsNote: "Ces inconforts sont très fréquents en fin de grossesse. Écoute ton corps et demande de l'aide si besoin.",
    endMessage: "Tu t'approches de la rencontre. Tu as déjà fait un chemin immense. On continue ensemble, doucement."
  },
  35: {
    week: 35,
    trimester: 3,
    title: "Semaine 35",
    subtitle: "L'affinement des réflexes",
    babyName: "Chou coco",
    babyIcon: "🥥",
    babyLength: "46.2 cm",
    babyWeight: "2.4 kg",
    babyDesc: "Ses réflexes de succion et de déglutition sont parfaitement coordonnés. Sa peau devient toute douce et rose.",
    momDesc: "La consultation du 9ème mois approche. C'est le moment de faire le point sur les signes de départ à la maternité.",
    tips: [
      "Relis tranquillement ton projet de naissance",
      "Vérifie que la valise pour la salle de naissance est prête",
      "Pratique des massages du périnée à l'huile d'amande douce si recommandée"
    ],
    symptoms: ["Pression pelvienne plus forte", "Envie d'uriner très rapprochée", "Besoin de repos"],
    symptomsNote: "Bébé descend doucement dans le bassin, dégageant un peu ton diaphragme.",
    endMessage: "Tout ton être se prépare à la rencontre."
  },
  36: {
    week: 36,
    trimester: 3,
    title: "Semaine 36",
    subtitle: "Presque prêt pour le monde",
    babyName: "Melon d'eau",
    babyIcon: "🍉",
    babyLength: "47.4 cm",
    babyWeight: "2.6 kg",
    babyDesc: "À la fin de cette semaine, bébé ne sera plus considéré comme prématuré ! Ses systèmes sont mûrs.",
    momDesc: "Respirez : bébé descend un peu dans le bassin, ce qui te permet de retrouver un peu d'aisance respiratoire.",
    tips: [
      "Profite des moments de calme pour te reposer en musique",
      "Installe le siège auto dans la voiture par précaution",
      "Note les numéros utiles de la maternité bien en évidence"
    ],
    symptoms: ["Respiration plus facile", "Pression accrue sur le col", "Contractions régulières d'entraînement"],
    symptomsNote: "Si le ventre descend, c'est signe que bébé trouve son chemin d'engagement.",
    endMessage: "Une immense victoire : bébé est désormais à terme très bientôt."
  },
  37: {
    week: 37,
    trimester: 3,
    title: "Semaine 37",
    subtitle: "Bébé est à terme",
    babyName: "Chou romanesco",
    babyIcon: "🥦",
    babyLength: "48.6 cm",
    babyWeight: "2.9 kg",
    babyDesc: "Bébé est officiellement à terme ! Il continue de prendre environ 200 g par semaine au chaud.",
    momDesc: "L'accouchement peut survenir à tout moment dans les prochaines semaines. Vis chaque jour en conscience.",
    tips: [
      "Ne cherche pas à hâter les choses, laisse le timing naturel s'opérer",
      "Reste dans une bulle d'amour, de calme et d'oxytocine",
      "Mange des dattes si tu aimes cela (réputées pour favoriser le travail)"
    ],
    symptoms: ["Perte possible du bouchon muqueux", "Contractions de travail potentielles", "Sommeil très haché"],
    symptomsNote: "La perte du bouchon muqueux indique simplement que le col se modifie, sans urgence.",
    endMessage: "Reste dans ta bulle de douceur. La magie peut opérer à tout moment."
  },
  38: {
    week: 38,
    trimester: 3,
    title: "Semaine 38",
    subtitle: "Dans l'attente paisible",
    babyName: "Poireau géant",
    babyIcon: "🥬",
    babyLength: "49.8 cm",
    babyWeight: "3.1 kg",
    babyDesc: "Ses intestins accumulent le méconium (ses premières selles). Bébé est un véritable nouveau-né miniature.",
    momDesc: "L'impatience et la hâte de rencontrer bébé sont bien présentes. Entoure-toi de douceur.",
    tips: [
      "Pratique de la méditation d'ancrage dans MamanZen",
      "Laisse ton/ta partenaire s'occuper du quotidien",
      "Dors ou repose-toi dès que possible"
    ],
    symptoms: ["Contractions plus fréquentes", "Besoin d'isolement bienveillant", "Sensations d'étirement"],
    symptomsNote: "Isole-toi du bruit et du stress extérieur pour favoriser la sécrétion d'oxytocine.",
    endMessage: "La patience est l'écrin de cette belle rencontre."
  },
  39: {
    week: 39,
    trimester: 3,
    title: "Semaine 39",
    subtitle: "Prêt pour le grand saut",
    babyName: "Citrouille",
    babyIcon: "🎃",
    babyLength: "50.7 cm",
    babyWeight: "3.3 kg",
    babyDesc: "Son cerveau et ses poumons sont au sommet de leur préparation. Il attend le signal hormonal idéal.",
    momDesc: "Guette les signes d'un travail débutant : contractions régulières et rapprochées, ou rupture de la poche des eaux.",
    tips: [
      "Prends une douche ou un bain chaud si tu as des contractions douteuses",
      "Garde une valise prête dans l'entrée",
      "Fais confiance à la force innée de ton corps"
    ],
    symptoms: ["Contractions régulières de travail", "Rupture des poches possible", "Grand calme intérieur"],
    symptomsNote: "Si les contractions deviennent douloureuses et espacées de 5 min pendant 1h, appelle la maternité.",
    endMessage: "Tu es prête. Ton corps sait exactement comment faire."
  },
  40: {
    week: 40,
    trimester: 3,
    title: "Semaine 40",
    subtitle: "Le grand jour de la rencontre",
    babyName: "Pastèque",
    babyIcon: "🍉",
    babyLength: "51.2 cm",
    babyWeight: "3.4 kg",
    babyDesc: "Bébé est prêt à te serrer dans ses bras ! Bienvenue au terme officiel de votre aventure prénatale.",
    momDesc: "C'est la fin officielle de la grossesse. Si bébé n'est pas encore arrivé, pas d'inquiétude : un petit suivi médical doux s'assurera de son bien-être.",
    tips: [
      "Reste sereine si le terme dépasse légèrement",
      "Consulte ta maternité pour un contrôle de surveillance bienveillant",
      "Visualise avec amour le moment où tu le prendras contre ta poitrine"
    ],
    symptoms: ["Signes d'accouchement imminent", "Patience infinie", "Émotion intense"],
    symptomsNote: "Quelques jours de plus sont très fréquents pour un premier bébé.",
    endMessage: "Un amour infini t'attend. Félicitations pour ce chemin extraordinaire."
  }
};

export function getWeeklyInfo(weekNum: number): WeeklyInfo {
  const rounded = Math.min(Math.max(Math.round(weekNum), 1), 40);
  if (WEEKLY_DATA[rounded]) {
    return WEEKLY_DATA[rounded];
  }
  // Fallback if key missing
  const keys = Object.keys(WEEKLY_DATA).map(Number).sort((a, b) => a - b);
  let closest = keys[0];
  for (const k of keys) {
    if (k <= rounded) closest = k;
  }
  return {
    ...WEEKLY_DATA[closest],
    week: rounded,
    title: `Semaine ${rounded}`
  };
}

export function getPregnancyInfo(dueDateStr?: string, weekNum?: number) {
  const week = weekNum || 20;
  const info = getWeeklyInfo(week);
  return {
    currentWeek: info.week,
    trimester: info.trimester,
    daysLeft: Math.max(0, (40 - info.week) * 7),
    babyInfo: {
      name: info.babyName,
      icon: info.babyIcon,
      desc: info.babyDesc
    }
  };
}

export function getGreeting(name: string): { text: string; icon: string } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { text: `Bonjour ${name}`, icon: "☀️" };
  } else if (hour >= 12 && hour < 18) {
    return { text: `Doux après-midi ${name}`, icon: "🌸" };
  } else if (hour >= 18 && hour < 22) {
    return { text: `Bonsoir ${name}`, icon: "🌙" };
  } else {
    return { text: `Douce nuit ${name}`, icon: "✨" };
  }
}
