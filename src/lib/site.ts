// 首页 FAQ、隐私政策、用户条款。价格跟 PetsDaily：免费、$6/月 Plus、$12/月家庭。
import type { Lang } from "./types";

export const SITE_URL = "https://www.petsdaily.live/";
export const SITE_MAIL = "hello@petsdaily.live";

export function pricePeriod(lang: Lang): string {
  if (lang === "zh" || lang === "ja") return "/ 月";
  if (lang === "ko") return "/ 월";
  if (lang === "de") return "/ Mon.";
  if (lang === "fr") return "/ mois";
  if (lang === "es") return "/ mes";
  if (lang === "pt") return "/ mês";
  return "/ mo";
}

type Qa = { q: string; a: string };
type Block = { h: string; body: string[] };
export type SiteCopy = {
  faqTitle: string;
  faqs: Qa[];
  privacyTitle: string;
  termsTitle: string;
  updated: string;
  privacy: Block[];
  terms: Block[];
  foot: {
    blurb: string;
    product: string;
    how: string;
    gift: string;
    pricing: string;
    faq: string;
    legal: string;
    privacy: string;
    terms: string;
    copy: string;
  };
};

const SITE: Record<Lang, SiteCopy> = {
  en: {
    faqTitle: "Questions",
    updated: "Updated September 29, 2026",
    privacyTitle: "Privacy",
    termsTitle: "Terms",
    faqs: [
      { q: "How do you keep it looking like my pet?", a: "One clear face-on photo is enough to start. Extra angles make the face, fur, and eyes more consistent. We don't promise every portrait will be exact." },
      { q: "How do credits work?", a: "One credit makes one picture. Free is $0: 1 pet and 8 pictures a month. Plus is $6 a month: 5 pets and no monthly cap. Family is $12 a month: 15 pets and everything in Plus." },
      { q: "Can I send one as a gift?", a: "Yes. Write a card and send the link. They open it with no account." },
      { q: "Are these AI images?", a: "Yes. Every portrait is generated from the photos you upload. A free preview carries a small PetsDaily mark." },
      { q: "What happens to my photos?", a: "We use them to make your portraits and diary notes, and to keep your library when you come back. We don't sell them. Account → Privacy removes the photos and portraits from your library." },
      { q: "Can I get a refund?", a: "Checkout isn't charging yet, so nothing is billed. When payment is on, Plus and Family renew monthly until you cancel." },
      { q: "Will you post my pet in public?", a: "Only if you publish it to the Plaza. Taking it down removes it there. A link you already sent still opens until you delete that portrait." },
      { q: "Which languages?", a: "English, Español, Português, Français, Deutsch, 日本語, 한국어, and 简体中文. The switch is in the header." },
    ],
    privacy: [
      { h: "Who we are", body: ["PetsDaily runs www.petsdaily.live. This policy covers the photos, portraits, and account details you give us there. Write to hello@petsdaily.live if something here is unclear."] },
      { h: "What we collect", body: ["The email you sign in with, and a Google profile if you choose Google. Pet details you type, such as name, breed, and coat. Photos you upload. Portraits, diary lines, and gift cards we generate. Your language, credit balance, and which pack you bought."] },
      { h: "What we use it for", body: ["We use this to make a portrait that still looks like your pet, to keep your library, and to open a gift link when you ask. We don't sell your photos or the portraits."] },
      { h: "Who else sees a photo", body: ["To make a portrait, the photo and a short description go to our image provider. They return the picture. They don't get a product of yours to resell. A gift link shows the card and portraits to whoever has the link. The Plaza shows a portrait only after you publish it."] },
      { h: "How long we keep it", body: ["Photos and portraits stay in your account until you delete them. Account → Privacy removes them from your library. A link you already sent can keep opening until those images are gone."] },
      { h: "Children", body: ["PetsDaily is for adults making pictures of their pets. Don't upload photos of children."] },
    ],
    terms: [
      { h: "The service", body: ["PetsDaily turns a photo of your pet into an AI portrait on www.petsdaily.live. One clear face-on photo is enough to start. More photos usually look more like them. We don't promise a perfect match."] },
      { h: "Credits", body: ["Free is $0: 1 pet and 8 pictures a month. Plus is $6 a month: 5 pets and no monthly cap. Family is $12 a month: 15 pets and everything in Plus. The prices on the pricing page are the ones that apply."] },
      { h: "Your photos", body: ["You confirm you can use every photo you upload. Don't upload someone else's pet, a person, or anything you don't have the rights to."] },
      { h: "The pictures we make", body: ["Portraits are AI-generated. You can share and gift the ones you spent a credit on. Free previews may show a small PetsDaily mark. Don't present an AI portrait as an unedited photograph."] },
      { h: "Gifts and the Plaza", body: ["A gift link opens without an account. You are responsible for the card and for who receives the link. Publishing to the Plaza lets us show that portrait on the site. Taking it down removes it from the Plaza."] },
      { h: "Refunds", body: ["Checkout isn't charging yet, so nothing is billed. When payment is on, Plus and Family renew monthly until you cancel."] },
      { h: "If we have to stop", body: ["We can refuse an upload that breaks these terms, and we can pause the site for a fix. These terms are the agreement for using PetsDaily."] },
    ],
    foot: {
      blurb: "One clear photo. A reaction that still looks like your pet.",
      product: "Product", how: "How it works", gift: "Gifts", pricing: "Pricing", faq: "FAQ",
      legal: "Legal", privacy: "Privacy", terms: "Terms",
      copy: "© 2026 PetsDaily — portraits are AI-generated",
    },
  },
  es: {
    faqTitle: "Preguntas",
    updated: "Actualizado el 29 de septiembre de 2026",
    privacyTitle: "Privacidad",
    termsTitle: "Términos",
    faqs: [
      { q: "¿Cómo logran que se parezca a mi mascota?", a: "Con una foto clara de frente basta para empezar. Más ángulos afianzan la cara, el pelo y los ojos. No prometemos que cada retrato sea exacto." },
      { q: "¿Cómo funcionan los créditos?", a: "1 crédito hace 1 imagen. Gratis: $0, 1 mascota y 8 imágenes al mes. Plus: $6 al mes, 5 mascotas y sin tope mensual. Familia: $12 al mes, 15 mascotas y todo lo de Plus." },
      { q: "¿Puedo enviarlo de regalo?", a: "Sí. Escribes una tarjeta y envías el enlace. Lo abren sin cuenta." },
      { q: "¿Son imágenes de IA?", a: "Sí. Cada retrato se genera a partir de las fotos que subes. La vista previa gratis lleva una pequeña marca de PetsDaily." },
      { q: "¿Qué pasa con mis fotos?", a: "Las usamos para hacer tus retratos y notas de diario, y para guardar tu biblioteca. No las vendemos. Cuenta → Privacidad las quita de tu biblioteca." },
      { q: "¿Hay reembolso?", a: "El pago aún no cobra nada. Cuando cobre, Plus y Familia se renuevan cada mes hasta que canceles." },
      { q: "¿Publican a mi mascota?", a: "Solo si tú lo publicas en la Plaza. Al quitarlo, desaparece de allí. Un enlace ya enviado sigue abriendo hasta que borres ese retrato." },
      { q: "¿Qué idiomas hay?", a: "English, Español, Português, Français, Deutsch, 日本語, 한국어 y 简体中文. El selector está en la cabecera." },
    ],
    privacy: [
      { h: "Quiénes somos", body: ["PetsDaily opera www.petsdaily.live. Esta política cubre las fotos, los retratos y los datos de cuenta que nos das ahí. Escribe a hello@petsdaily.live si algo no queda claro."] },
      { h: "Qué recogemos", body: ["El correo con el que entras, y un perfil de Google si eliges Google. Los datos de la mascota que escribes, como nombre, raza y pelaje. Las fotos que subes. Los retratos, las líneas del diario y las tarjetas que generamos. Tu idioma, el saldo de créditos y el paquete que compraste."] },
      { h: "Para qué lo usamos", body: ["Lo usamos para hacer un retrato que siga pareciéndose a tu mascota, para guardar tu biblioteca y para abrir un enlace de regalo cuando lo pides. No vendemos tus fotos ni los retratos."] },
      { h: "Quién más ve una foto", body: ["Para hacer un retrato, la foto y una descripción corta van a nuestro proveedor de imágenes. Devuelven la imagen. No reciben un producto tuyo para revenderlo. Un enlace de regalo muestra la tarjeta y los retratos a quien tenga el enlace. La Plaza muestra un retrato solo después de que lo publicas."] },
      { h: "Cuánto tiempo lo guardamos", body: ["Las fotos y los retratos siguen en tu cuenta hasta que los borras. Cuenta → Privacidad los quita de tu biblioteca. Un enlace ya enviado puede seguir abriendo hasta que esas imágenes desaparezcan."] },
      { h: "Menores", body: ["PetsDaily es para adultos que hacen imágenes de sus mascotas. No subas fotos de niños."] },
    ],
    terms: [
      { h: "El servicio", body: ["PetsDaily convierte una foto de tu mascota en un retrato de IA en www.petsdaily.live. Una foto clara de frente basta para empezar. Con más fotos suele parecerse más. No prometemos un parecido perfecto."] },
      { h: "Créditos", body: ["Gratis es $0: 1 mascota y 8 imágenes al mes. Plus es $6 al mes: 5 mascotas y sin tope mensual. Familia es $12 al mes: 15 mascotas y todo lo de Plus. Valen los precios de la página de precios."] },
      { h: "Tus fotos", body: ["Confirmas que puedes usar cada foto que subes. No subas la mascota de otra persona, una persona, ni nada sobre lo que no tengas derechos."] },
      { h: "Las imágenes que hacemos", body: ["Los retratos los genera una IA. Puedes compartir y regalar los que hayas pagado con un crédito. Las vistas previas gratis pueden llevar una pequeña marca de PetsDaily. No presentes un retrato de IA como una fotografía sin editar."] },
      { h: "Regalos y la Plaza", body: ["Un enlace de regalo se abre sin cuenta. Tú respondes de la tarjeta y de quién recibe el enlace. Publicar en la Plaza nos permite mostrar ese retrato en el sitio. Quitarlo lo saca de la Plaza."] },
      { h: "Reembolsos", body: ["El pago aún no cobra nada. Cuando cobre, Plus y Familia se renuevan cada mes hasta que canceles."] },
      { h: "Si tenemos que parar", body: ["Podemos rechazar una subida que rompa estos términos, y pausar el sitio para arreglarlo. Estos términos son el acuerdo para usar PetsDaily."] },
    ],
    foot: {
      blurb: "Una foto clara. Una reacción que sigue siendo tu mascota.",
      product: "Producto", how: "Cómo funciona", gift: "Regalos", pricing: "Precios", faq: "Preguntas",
      legal: "Legal", privacy: "Privacidad", terms: "Términos",
      copy: "© 2026 PetsDaily — los retratos son generados por IA",
    },
  },
  pt: {
    faqTitle: "Dúvidas",
    updated: "Atualizado em 29 de setembro de 2026",
    privacyTitle: "Privacidade",
    termsTitle: "Termos",
    faqs: [
      { q: "Como vocês fazem parecer o meu pet?", a: "Uma foto clara de frente já começa. Mais ângulos firmam o rosto, o pelo e os olhos. Não prometemos que cada retrato seja exato." },
      { q: "Como funcionam os créditos?", a: "1 crédito faz 1 imagem. Grátis: $0, 1 pet e 8 imagens por mês. Plus: $6 por mês, 5 pets e sem limite mensal. Família: $12 por mês, 15 pets e tudo do Plus." },
      { q: "Dá para mandar de presente?", a: "Sim. Você escreve um cartão e envia o link. A pessoa abre sem conta." },
      { q: "As imagens são de IA?", a: "Sim. Cada retrato é gerado a partir das fotos que você envia. A prévia grátis leva uma pequena marca PetsDaily." },
      { q: "O que acontece com as minhas fotos?", a: "Usamos para fazer seus retratos e notas do diário, e para guardar sua biblioteca. Não vendemos. Conta → Privacidade tira as fotos e os retratos da biblioteca." },
      { q: "Tem reembolso?", a: "O pagamento ainda não cobra nada. Quando cobrar, Plus e Família renovam todo mês até você cancelar." },
      { q: "Vocês publicam o meu pet?", a: "Só se você publicar na Praça. Ao retirar, some de lá. Um link já enviado continua abrindo até você apagar esse retrato." },
      { q: "Quais idiomas?", a: "English, Español, Português, Français, Deutsch, 日本語, 한국어 e 简体中文. O seletor fica no topo." },
    ],
    privacy: [
      { h: "Quem somos", body: ["A PetsDaily opera www.petsdaily.live. Esta política cobre as fotos, os retratos e os dados da conta que você deixa lá. Escreva para hello@petsdaily.live se algo não ficar claro."] },
      { h: "O que coletamos", body: ["O e-mail com que você entra, e um perfil do Google se escolher Google. Os dados do pet que você escreve, como nome, raça e pelagem. As fotos que envia. Os retratos, as linhas do diário e os cartões que geramos. Seu idioma, o saldo de créditos e o pacote que comprou."] },
      { h: "Para que usamos", body: ["Usamos para fazer um retrato que ainda pareça o seu pet, para guardar sua biblioteca e para abrir um link de presente quando você pede. Não vendemos suas fotos nem os retratos."] },
      { h: "Quem mais vê uma foto", body: ["Para fazer um retrato, a foto e uma descrição curta vão ao nosso provedor de imagens. Eles devolvem a imagem. Não recebem um produto seu para revender. Um link de presente mostra o cartão e os retratos a quem tiver o link. A Praça mostra um retrato só depois que você publica."] },
      { h: "Por quanto tempo guardamos", body: ["Fotos e retratos ficam na sua conta até você apagar. Conta → Privacidade tira tudo da biblioteca. Um link já enviado pode continuar abrindo até essas imagens sumirem."] },
      { h: "Crianças", body: ["A PetsDaily é para adultos que fazem imagens dos seus pets. Não envie fotos de crianças."] },
    ],
    terms: [
      { h: "O serviço", body: ["A PetsDaily transforma uma foto do seu pet em um retrato de IA em www.petsdaily.live. Uma foto clara de frente basta para começar. Com mais fotos, costuma parecer mais. Não prometemos uma semelhança perfeita."] },
      { h: "Créditos", body: ["Grátis é $0: 1 pet e 8 imagens por mês. Plus é $6 por mês: 5 pets e sem limite mensal. Família é $12 por mês: 15 pets e tudo do Plus. Valem os preços da página de preços."] },
      { h: "Suas fotos", body: ["Você confirma que pode usar cada foto que envia. Não envie o pet de outra pessoa, uma pessoa, nem nada sobre o que você não tenha direitos."] },
      { h: "As imagens que fazemos", body: ["Os retratos são gerados por IA. Você pode compartilhar e presentear os que pagou com um crédito. Prévias grátis podem levar uma pequena marca PetsDaily. Não apresente um retrato de IA como uma fotografia sem edição."] },
      { h: "Presentes e a Praça", body: ["Um link de presente abre sem conta. Você responde pelo cartão e por quem recebe o link. Publicar na Praça nos permite mostrar esse retrato no site. Retirar tira da Praça."] },
      { h: "Reembolsos", body: ["O pagamento ainda não cobra nada. Quando cobrar, Plus e Família renovam todo mês até você cancelar."] },
      { h: "Se precisarmos parar", body: ["Podemos recusar um envio que quebre estes termos, e pausar o site para um conserto. Estes termos são o acordo para usar a PetsDaily."] },
    ],
    foot: {
      blurb: "Uma foto clara. Uma reação que ainda é o seu pet.",
      product: "Produto", how: "Como funciona", gift: "Presentes", pricing: "Preços", faq: "Dúvidas",
      legal: "Legal", privacy: "Privacidade", terms: "Termos",
      copy: "© 2026 PetsDaily — os retratos são gerados por IA",
    },
  },
  fr: {
    faqTitle: "Questions",
    updated: "Mis à jour le 29 septembre 2026",
    privacyTitle: "Confidentialité",
    termsTitle: "Conditions",
    faqs: [
      { q: "Comment ça reste ressemblant ?", a: "Une photo nette de face suffit pour commencer. D'autres angles stabilisent le visage, le poil et les yeux. Nous ne promettons pas un portrait exact à chaque fois." },
      { q: "Comment marchent les crédits ?", a: "1 crédit fait 1 image. Gratuit : 0 $, 1 animal et 8 images par mois. Plus : 6 $ par mois, 5 animaux et sans plafond mensuel. Famille : 12 $ par mois, 15 animaux et tout Plus." },
      { q: "Je peux l'offrir ?", a: "Oui. Vous écrivez une carte et envoyez le lien. La personne l'ouvre sans compte." },
      { q: "Ce sont des images d'IA ?", a: "Oui. Chaque portrait est généré à partir des photos que vous envoyez. Un aperçu gratuit porte une petite marque PetsDaily." },
      { q: "Que deviennent mes photos ?", a: "Nous les utilisons pour vos portraits et les notes du journal, et pour garder votre bibliothèque. Nous ne les vendons pas. Compte → Confidentialité les retire de la bibliothèque." },
      { q: "Puis-je être remboursé ?", a: "Le paiement ne débite rien pour l'instant. Quand il le fera, Plus et Famille se renouvellent chaque mois jusqu'à annulation." },
      { q: "Vous publiez mon animal ?", a: "Seulement si vous le publiez sur la Place. Le retirer l'enlève de là. Un lien déjà envoyé s'ouvre encore jusqu'à ce que vous supprimiez ce portrait." },
      { q: "Quelles langues ?", a: "English, Español, Português, Français, Deutsch, 日本語, 한국어 et 简体中文. Le choix est dans l'en-tête." },
    ],
    privacy: [
      { h: "Qui nous sommes", body: ["PetsDaily exploite www.petsdaily.live. Cette politique couvre les photos, les portraits et les informations de compte que vous nous y donnez. Écrivez à hello@petsdaily.live si un point n'est pas clair."] },
      { h: "Ce que nous collectons", body: ["L'e-mail de connexion, et un profil Google si vous choisissez Google. Les détails de l'animal que vous saisissez, comme le nom, la race et le pelage. Les photos envoyées. Les portraits, les lignes du journal et les cartes que nous générons. Votre langue, le solde de crédits et le pack acheté."] },
      { h: "À quoi cela sert", body: ["Nous nous en servons pour faire un portrait qui ressemble encore à votre animal, pour garder votre bibliothèque, et pour ouvrir un lien cadeau quand vous le demandez. Nous ne vendons ni vos photos ni les portraits."] },
      { h: "Qui d'autre voit une photo", body: ["Pour faire un portrait, la photo et une courte description partent chez notre fournisseur d'images. Il renvoie l'image. Il ne reçoit pas un produit à revendre. Un lien cadeau montre la carte et les portraits à qui a le lien. La Place n'affiche un portrait qu'après votre publication."] },
      { h: "Combien de temps nous gardons", body: ["Les photos et les portraits restent dans votre compte jusqu'à ce que vous les supprimiez. Compte → Confidentialité les retire de la bibliothèque. Un lien déjà envoyé peut continuer à s'ouvrir tant que ces images sont là."] },
      { h: "Enfants", body: ["PetsDaily s'adresse aux adultes qui font des images de leurs animaux. N'envoyez pas de photos d'enfants."] },
    ],
    terms: [
      { h: "Le service", body: ["PetsDaily transforme une photo de votre animal en portrait d'IA sur www.petsdaily.live. Une photo nette de face suffit pour commencer. Plus de photos, en général, ressemblent davantage. Nous ne promettons pas une ressemblance parfaite."] },
      { h: "Crédits", body: ["Gratuit : 0 $, 1 animal et 8 images par mois. Plus : 6 $ par mois, 5 animaux et sans plafond mensuel. Famille : 12 $ par mois, 15 animaux et tout Plus. Les prix de la page tarifs font foi."] },
      { h: "Vos photos", body: ["Vous confirmez pouvoir utiliser chaque photo envoyée. N'envoyez pas l'animal de quelqu'un d'autre, une personne, ni quoi que ce soit dont vous n'avez pas les droits."] },
      { h: "Les images que nous faisons", body: ["Les portraits sont générés par IA. Vous pouvez partager et offrir ceux payés avec un crédit. Les aperçus gratuits peuvent porter une petite marque PetsDaily. Ne présentez pas un portrait d'IA comme une photographie non retouchée."] },
      { h: "Cadeaux et la Place", body: ["Un lien cadeau s'ouvre sans compte. Vous répondez de la carte et de qui reçoit le lien. Publier sur la Place nous permet d'afficher ce portrait sur le site. Le retirer l'enlève de la Place."] },
      { h: "Remboursements", body: ["Le paiement ne débite rien pour l'instant. Quand il le fera, Plus et Famille se renouvellent chaque mois jusqu'à annulation."] },
      { h: "Si nous devons arrêter", body: ["Nous pouvons refuser un envoi qui enfreint ces conditions, et mettre le site en pause pour une correction. Ces conditions sont l'accord d'utilisation de PetsDaily."] },
    ],
    foot: {
      blurb: "Une photo nette. Une réaction qui est encore votre animal.",
      product: "Produit", how: "Comment ça marche", gift: "Cadeaux", pricing: "Tarifs", faq: "FAQ",
      legal: "Mentions", privacy: "Confidentialité", terms: "Conditions",
      copy: "© 2026 PetsDaily — les portraits sont générés par IA",
    },
  },
  de: {
    faqTitle: "Fragen",
    updated: "Stand 29. September 2026",
    privacyTitle: "Datenschutz",
    termsTitle: "Bedingungen",
    faqs: [
      { q: "Wie bleibt es mein Tier?", a: "Ein klares Foto von vorn reicht zum Start. Weitere Winkel halten Gesicht, Fell und Augen stabiler. Wir versprechen nicht, dass jedes Porträt exakt trifft." },
      { q: "Wie funktionieren die Punkte?", a: "1 Punkt macht 1 Bild. Kostenlos: 0 $, 1 Tier und 8 Bilder im Monat. Plus: 6 $ im Monat, 5 Tiere und kein Monatslimit. Familie: 12 $ im Monat, 15 Tiere und alles aus Plus." },
      { q: "Kann ich eines verschenken?", a: "Ja. Du schreibst eine Karte und schickst den Link. Die Person öffnet ihn ohne Konto." },
      { q: "Sind das KI-Bilder?", a: "Ja. Jedes Porträt entsteht aus den Fotos, die du hochlädst. Eine kostenlose Vorschau trägt ein kleines PetsDaily-Zeichen." },
      { q: "Was passiert mit meinen Fotos?", a: "Wir nutzen sie für deine Porträts und Tagebuchzeilen und damit deine Sammlung bleibt. Wir verkaufen sie nicht. Konto → Datenschutz nimmt Fotos und Porträts aus der Sammlung." },
      { q: "Gibt es eine Erstattung?", a: "Die Kasse bucht noch nichts ab. Wenn sie das tut, verlängern sich Plus und Familie monatlich, bis du kündigst." },
      { q: "Stellt ihr mein Tier öffentlich?", a: "Nur wenn du es auf dem Platz veröffentlichst. Nimmst du es zurück, ist es dort weg. Ein schon verschickter Link öffnet weiter, bis du das Porträt löschst." },
      { q: "Welche Sprachen?", a: "English, Español, Português, Français, Deutsch, 日本語, 한국어 und 简体中文. Der Schalter sitzt in der Kopfzeile." },
    ],
    privacy: [
      { h: "Wer wir sind", body: ["PetsDaily betreibt www.petsdaily.live. Diese Hinweise gelten für die Fotos, Porträts und Kontodaten, die du uns dort gibst. Schreib an hello@petsdaily.live, wenn etwas unklar ist."] },
      { h: "Was wir erfassen", body: ["Die E-Mail, mit der du dich anmeldest, und ein Google-Profil, wenn du Google wählst. Tierangaben, die du eintippst, etwa Name, Rasse und Fell. Fotos, die du hochlädst. Porträts, Tagebuchzeilen und Karten, die wir erzeugen. Deine Sprache, dein Punktestand und welches Paket du gekauft hast."] },
      { h: "Wofür wir es nutzen", body: ["Wir nutzen es, um ein Porträt zu machen, das noch wie dein Tier aussieht, um deine Sammlung zu behalten und um einen Geschenklink zu öffnen, wenn du das willst. Wir verkaufen weder deine Fotos noch die Porträts."] },
      { h: "Wer ein Foto sonst sieht", body: ["Für ein Porträt gehen das Foto und eine kurze Beschreibung an unseren Bildanbieter. Er liefert das Bild zurück. Er bekommt kein Produkt von dir zum Weiterverkauf. Ein Geschenklink zeigt Karte und Porträts jedem, der den Link hat. Der Platz zeigt ein Porträt erst, nachdem du es veröffentlichst."] },
      { h: "Wie lange wir es behalten", body: ["Fotos und Porträts bleiben im Konto, bis du sie löschst. Konto → Datenschutz nimmt sie aus der Sammlung. Ein schon verschickter Link kann weiter aufgehen, bis diese Bilder weg sind."] },
      { h: "Kinder", body: ["PetsDaily ist für Erwachsene, die Bilder ihrer Tiere machen. Lade keine Fotos von Kindern hoch."] },
    ],
    terms: [
      { h: "Der Dienst", body: ["PetsDaily macht aus einem Foto deines Tiers ein KI-Porträt auf www.petsdaily.live. Ein klares Foto von vorn reicht zum Start. Mehr Fotos treffen meist besser. Eine perfekte Ähnlichkeit versprechen wir nicht."] },
      { h: "Punkte", body: ["Kostenlos ist 0 $: 1 Tier und 8 Bilder im Monat. Plus ist 6 $ im Monat: 5 Tiere und kein Monatslimit. Familie ist 12 $ im Monat: 15 Tiere und alles aus Plus. Es gelten die Preise auf der Preisseite."] },
      { h: "Deine Fotos", body: ["Du bestätigst, dass du jedes hochgeladene Foto nutzen darfst. Lade nicht das Tier einer anderen Person hoch, keine Person und nichts, woran du keine Rechte hast."] },
      { h: "Die Bilder, die wir machen", body: ["Porträts erzeugt eine KI. Teilen und verschenken darfst du die, für die du einen Punkt ausgegeben hast. Kostenlose Vorschauen können ein kleines PetsDaily-Zeichen tragen. Stell ein KI-Porträt nicht als unbearbeitetes Foto dar."] },
      { h: "Geschenke und der Platz", body: ["Ein Geschenklink öffnet ohne Konto. Du bist für die Karte verantwortlich und dafür, wer den Link bekommt. Veröffentlichen auf dem Platz erlaubt uns, dieses Porträt auf der Seite zu zeigen. Zurücknehmen entfernt es vom Platz."] },
      { h: "Erstattung", body: ["Die Kasse bucht noch nichts ab. Wenn sie das tut, verlängern sich Plus und Familie monatlich, bis du kündigst."] },
      { h: "Wenn wir anhalten müssen", body: ["Wir können einen Upload ablehnen, der diese Bedingungen bricht, und die Seite für eine Reparatur pausieren. Diese Bedingungen sind die Vereinbarung für PetsDaily."] },
    ],
    foot: {
      blurb: "Ein klares Foto. Eine Reaktion, die noch dein Tier ist.",
      product: "Produkt", how: "So geht's", gift: "Geschenke", pricing: "Preise", faq: "Fragen",
      legal: "Rechtliches", privacy: "Datenschutz", terms: "Bedingungen",
      copy: "© 2026 PetsDaily — Porträts sind KI-generiert",
    },
  },
  ja: {
    faqTitle: "よくある質問",
    updated: "2026年9月29日更新",
    privacyTitle: "プライバシー",
    termsTitle: "利用規約",
    faqs: [
      { q: "うちの子に似せられますか？", a: "正面の鮮明な写真が1枚あれば始められます。角度を足すと、顔・毛色・目が安定します。毎回ぴったり似るとは約束しません。" },
      { q: "ポイントはどう使いますか？", a: "1ポイントで1枚。無料は $0、ペット1匹、月8枚。Plus は月 $6、ペット5匹、月の上限なし。ファミリーは月 $12、ペット15匹、Plus のすべて。" },
      { q: "贈り物にできますか？", a: "できます。カードを書いてリンクを送ってください。相手はアカウントなしで開けます。" },
      { q: "画像はAIですか？", a: "はい。肖像はアップロードした写真から生成します。無料プレビューには小さな PetsDaily の印が入ります。" },
      { q: "写真はどう扱われますか？", a: "肖像と日記を作るため、そして次回も作品を見られるように使います。販売はしません。アカウント → プライバシーで、写真と肖像をライブラリから消せます。" },
      { q: "返金はできますか？", a: "支払いはまだ引き落としません。開始後は、Plus とファミリーは解約するまで毎月更新されます。" },
      { q: "勝手に公開されますか？", a: "広場へ自分で公開したときだけです。取り下げると広場から消えます。すでに送ったリンクは、その肖像を消すまで開けます。" },
      { q: "対応言語は？", a: "English、Español、Português、Français、Deutsch、日本語、한국어、简体中文。切り替えはページ上部にあります。" },
    ],
    privacy: [
      { h: "運営者", body: ["PetsDaily は www.petsdaily.live を運営しています。この方針は、そこで預ける写真・肖像・アカウント情報を対象にします。不明な点は hello@petsdaily.live へ。"] },
      { h: "集めるもの", body: ["ログインに使うメール。Google を選んだ場合はそのプロフィール。名前・種類・毛色など、入力したペット情報。アップロードした写真。生成した肖像、日記、ギフトカード。言語、ポイント残高、購入したパック。"] },
      { h: "使う目的", body: ["まだその子に見える肖像を作るため、ライブラリを残すため、頼まれたときにギフトリンクを開くために使います。写真も肖像も販売しません。"] },
      { h: "写真を見る相手", body: ["肖像を作るとき、写真と短い説明を画像の提供元へ送ります。返ってくるのは画像です。転売用の商品としては渡しません。ギフトリンクは、リンクを持っている人にカードと肖像を見せます。広場は、自分で公開した肖像だけを表示します。"] },
      { h: "保管期間", body: ["写真と肖像は、消すまでアカウントに残ります。アカウント → プライバシーでライブラリから外せます。すでに送ったリンクは、その画像がなくなるまで開けることがあります。"] },
      { h: "子ども", body: ["PetsDaily は、自分のペットの絵を作る大人向けです。子どもの写真はアップロードしないでください。"] },
    ],
    terms: [
      { h: "サービス", body: ["PetsDaily は www.petsdaily.live で、ペットの写真をAI肖像にします。正面の鮮明な写真が1枚あれば始められます。枚数が多いほど似やすいです。完全な一致は約束しません。"] },
      { h: "ポイント", body: ["無料は $0、ペット1匹、月8枚。Plus は月 $6、ペット5匹、月の上限なし。ファミリーは月 $12、ペット15匹、Plus のすべて。料金は価格ページの表示が適用されます。"] },
      { h: "あなたの写真", body: ["アップロードする写真は、使う権利があるものに限ります。他人のペット、人物、権利のないものは送らないでください。"] },
      { h: "作る画像", body: ["肖像はAIが生成します。ポイントを使ったものは、共有したり贈り物にしたりできます。無料プレビューには小さな PetsDaily の印が付くことがあります。AI肖像を、加工していない写真として出さないでください。"] },
      { h: "ギフトと広場", body: ["ギフトリンクはアカウントなしで開きます。カードの文面と、リンクを渡す相手はあなたが責任を持ちます。広場への公開は、その肖像をサイトに載せる許可です。取り下げると広場から消えます。"] },
      { h: "返金", body: ["支払いはまだ引き落としません。開始後は、Plus とファミリーは解約するまで毎月更新されます。"] },
      { h: "止めるとき", body: ["この規約に反するアップロードは拒否できます。修復のためにサイトを止めることもあります。この規約が PetsDaily を使ううえでの合意です。"] },
    ],
    foot: {
      blurb: "正面の一枚から。まだその子に見える表情を。",
      product: "製品", how: "使い方", gift: "ギフト", pricing: "料金", faq: "質問",
      legal: "法務", privacy: "プライバシー", terms: "利用規約",
      copy: "© 2026 PetsDaily — 肖像はAI生成です",
    },
  },
  ko: {
    faqTitle: "자주 묻는 질문",
    updated: "2026년 9월 29일 업데이트",
    privacyTitle: "개인정보",
    termsTitle: "이용약관",
    faqs: [
      { q: "우리 아이를 어떻게 닮게 하나요?", a: "정면의 선명한 사진 한 장이면 시작할 수 있습니다. 각도를 더하면 얼굴, 털, 눈이 더 안정됩니다. 모든 초상이 똑같이 나온다고 약속하지는 않습니다." },
      { q: "포인트는 어떻게 쓰나요?", a: "1포인트로 1장. 무료는 $0, 펫 1마리, 한 달 8장. Plus는 월 $6, 펫 5마리, 월 상한 없음. 패밀리는 월 $12, 펫 15마리, Plus의 전부." },
      { q: "선물로 보낼 수 있나요?", a: "보낼 수 있습니다. 카드를 쓰고 링크를 보내세요. 상대는 계정 없이 엽니다." },
      { q: "이미지는 AI인가요?", a: "맞습니다. 초상은 올린 사진으로 만듭니다. 무료 미리보기에는 작은 PetsDaily 표시가 붙습니다." },
      { q: "사진은 어떻게 되나요?", a: "초상과 일기를 만들고, 다음에 와서도 보관함을 보게 하는 데 씁니다. 팔지 않습니다. 계정 → 개인정보에서 사진과 초상을 보관함에서 지울 수 있습니다." },
      { q: "환불이 되나요?", a: "결제는 아직 청구하지 않습니다. 시작하면 Plus와 패밀리는 취소할 때까지 매월 갱신됩니다." },
      { q: "마음대로 공개되나요?", a: "광장에 직접 올릴 때만 보입니다. 내리면 광장에서 사라집니다. 이미 보낸 링크는 그 초상을 지우기 전까지 열립니다." },
      { q: "지원 언어는?", a: "English, Español, Português, Français, Deutsch, 日本語, 한국어, 简体中文. 전환은 상단에 있습니다." },
    ],
    privacy: [
      { h: "운영자", body: ["PetsDaily는 www.petsdaily.live 를 운영합니다. 이 방침은 그곳에서 맡기는 사진, 초상, 계정 정보를 다룹니다. 궁금한 점은 hello@petsdaily.live 로 보내 주세요."] },
      { h: "수집하는 것", body: ["로그인 이메일. Google을 고르면 그 프로필. 이름, 품종, 털색처럼 입력한 펫 정보. 올린 사진. 만든 초상, 일기, 선물 카드. 언어, 포인트 잔액, 산 패키지."] },
      { h: "쓰는 목적", body: ["아직 그 아이처럼 보이는 초상을 만들고, 보관함을 남기고, 요청할 때 선물 링크를 여는 데 씁니다. 사진과 초상은 팔지 않습니다."] },
      { h: "사진을 보는 쪽", body: ["초상을 만들 때 사진과 짧은 설명이 이미지 제공자에게 갑니다. 돌아오는 것은 이미지입니다. 되팔 상품으로 넘기지 않습니다. 선물 링크는 링크를 가진 사람에게 카드와 초상을 보여 줍니다. 광장은 직접 올린 초상만 보여 줍니다."] },
      { h: "보관 기간", body: ["사진과 초상은 지우기 전까지 계정에 남습니다. 계정 → 개인정보에서 보관함에서 뺍니다. 이미 보낸 링크는 그 이미지가 없어질 때까지 열릴 수 있습니다."] },
      { h: "어린이", body: ["PetsDaily는 자기 펫의 그림을 만드는 어른을 위한 서비스입니다. 어린이 사진은 올리지 마세요."] },
    ],
    terms: [
      { h: "서비스", body: ["PetsDaily는 www.petsdaily.live 에서 펫 사진을 AI 초상으로 만듭니다. 정면의 선명한 사진 한 장이면 시작할 수 있습니다. 사진이 많을수록 더 닮는 편이지만, 완벽한 일치는 약속하지 않습니다."] },
      { h: "포인트", body: ["무료는 $0, 펫 1마리, 한 달 8장. Plus는 월 $6, 펫 5마리, 월 상한 없음. 패밀리는 월 $12, 펫 15마리, Plus의 전부. 가격은 가격 페이지에 적힌 것이 적용됩니다."] },
      { h: "당신의 사진", body: ["올리는 사진마다 쓸 권리가 있다고 확인하는 것입니다. 다른 사람의 펫, 사람, 권리가 없는 것은 올리지 마세요."] },
      { h: "우리가 만드는 그림", body: ["초상은 AI가 만듭니다. 포인트를 쓴 것은 공유하고 선물할 수 있습니다. 무료 미리보기에는 작은 PetsDaily 표시가 붙을 수 있습니다. AI 초상을 보정하지 않은 사진인 것처럼 내놓지 마세요."] },
      { h: "선물과 광장", body: ["선물 링크는 계정 없이 열립니다. 카드 문구와 링크를 받는 사람은 당신이 책임집니다. 광장에 올리면 그 초상을 사이트에 보여도 된다는 뜻입니다. 내리면 광장에서 사라집니다."] },
      { h: "환불", body: ["결제는 아직 청구하지 않습니다. 시작하면 Plus와 패밀리는 취소할 때까지 매월 갱신됩니다."] },
      { h: "멈춰야 할 때", body: ["이 약관을 깨는 업로드는 거절할 수 있고, 수리를 위해 사이트를 잠시 멈출 수 있습니다. 이 약관이 PetsDaily를 쓰는 합의입니다."] },
    ],
    foot: {
      blurb: "선명한 한 장. 아직 그 아이인 표정.",
      product: "제품", how: "이용 방법", gift: "선물", pricing: "가격", faq: "질문",
      legal: "법적 고지", privacy: "개인정보", terms: "이용약관",
      copy: "© 2026 PetsDaily — 초상은 AI로 생성됩니다",
    },
  },
  zh: {
    faqTitle: "常见问题",
    updated: "2026年9月29日更新",
    privacyTitle: "隐私政策",
    termsTitle: "用户条款",
    faqs: [
      { q: "怎么才能像我家宠物？", a: "一张清晰的正脸就能开始。多几张侧面和不同表情，脸、毛色和眼睛会更稳。我们不保证每张都一模一样。" },
      { q: "点数怎么算？", a: "1 点做 1 张。免费 $0：1 只宠物，每月 8 张。Plus 每月 $6：5 只宠物，不设月上限。家庭每月 $12：15 只宠物，包含 Plus 的全部。" },
      { q: "能当礼物送吗？", a: "可以。写一张贺卡，把链接发出去。对方不用注册就能打开。" },
      { q: "这些图是 AI 做的吗？", a: "是。每张肖像都根据你上传的照片生成。免费预览会带一个小小的 PetsDaily 标记。" },
      { q: "照片会拿去干什么？", a: "用来做你的肖像和日记，也用来让你下次还能看到作品。我们不出售这些照片。到账户里的隐私一项，可以把照片和肖像从作品库里删掉。" },
      { q: "可以退款吗？", a: "支付还没开通，现在不会扣款。开通之后，Plus 和家庭按月续费，取消后不再扣。" },
      { q: "会上广场给别人看吗？", a: "只有你自己点了发布，才会出现在广场。撤下之后，广场上看不到。已经发出去的链接，在你删掉这张图之前还能打开。" },
      { q: "支持哪些语言？", a: "English、Español、Português、Français、Deutsch、日本語、한국어、简体中文。在页头切换。" },
    ],
    privacy: [
      { h: "我们是谁", body: ["PetsDaily 运营 www.petsdaily.live。本政策说明你在这里留下的照片、肖像和账户信息如何被使用。看不明白写到 hello@petsdaily.live。"] },
      { h: "我们收集什么", body: ["登录用的邮箱；如果你选了 Google，还有 Google 资料。你填写的宠物信息，比如名字、品种、毛色。你上传的照片。我们生成的肖像、日记和贺卡。你的语言、点数余额，以及买过的点数包。"] },
      { h: "用来做什么", body: ["用来做出还像你家宠物的肖像，留下来让你下次能看到，以及在你要求时打开礼物链接。我们不出售你的照片和肖像。"] },
      { h: "还有谁会看到照片", body: ["做肖像时，照片和一句简短说明会发给图像服务商，用来返回这张图，不会当成可转卖的商品交给他们。礼物链接会把贺卡和肖像显示给拿到链接的人。广场只展示你自己发布的肖像。"] },
      { h: "保留多久", body: ["照片和肖像会留在账户里，直到你删除。账户里的隐私一项会把它们从作品库去掉。已经发出去的链接，在这些图被删掉之前仍可能打开。"] },
      { h: "儿童", body: ["PetsDaily 给成年人用来给自家宠物做图。不要上传儿童的照片。"] },
    ],
    terms: [
      { h: "服务", body: ["PetsDaily 在 www.petsdaily.live 把宠物照片做成 AI 肖像。一张清晰的正脸就能开始。照片多一些，通常更像。我们不保证完全一致。"] },
      { h: "点数", body: ["免费 $0：1 只宠物，每月 8 张。Plus 每月 $6：5 只宠物，不设月上限。家庭每月 $12：15 只宠物，包含 Plus 的全部。价格以价格页显示为准。"] },
      { h: "你的照片", body: ["你确认自己有权使用上传的每一张照片。不要上传别人的宠物、人物，或你没有权利使用的内容。"] },
      { h: "我们做出的图", body: ["肖像由 AI 生成。花了点数的图可以分享，也可以当礼物。免费预览可能带一个小小的 PetsDaily 标记。不要把 AI 肖像说成未经处理的照片。"] },
      { h: "礼物和广场", body: ["礼物链接不用注册就能打开。贺卡写给谁、链接发给谁，由你负责。发布到广场，表示允许我们在站内展示这张肖像。撤下后，广场不再显示。"] },
      { h: "退款", body: ["支付还没开通，现在不会扣款。开通之后，Plus 和家庭按月续费，取消后不再扣。"] },
      { h: "我们不得不停的时候", body: ["违反这些条款的上传可以被拒绝。为了修复，站点也可能暂停。这些条款就是使用 PetsDaily 的约定。"] },
    ],
    foot: {
      blurb: "一张正脸。一张还是你家宠物的表情。",
      product: "产品", how: "怎么做", gift: "礼物", pricing: "价格", faq: "常见问题",
      legal: "条款", privacy: "隐私政策", terms: "用户条款",
      copy: "© 2026 PetsDaily — 肖像由 AI 生成",
    },
  },
};

export function siteCopy(lang: Lang): SiteCopy {
  return SITE[lang];
}

if (process.env.SITE_CHECK) {
  const langs = Object.keys(SITE) as Lang[];
  for (const l of langs) {
    const c = SITE[l];
    if (c.faqs.length !== 8 || c.privacy.length < 5 || c.terms.length < 5) throw new Error(`site ${l}`);
  }
}
