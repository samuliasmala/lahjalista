package.json

Seuraavia paketteja ei ole päivitetty

Major Potentially breaking API changes
❯ ◯ @prisma/client 5.20.0 → 6.2.1
◯ @types/node 20.12.4 → 22.10.6
◯ prisma 5.20.0 → 6.2.1

`@prisma/client`iä ja `prisma`a ei ole päivitetty, koska `lucia-auth`in peer-dependency ei tue vielä Prisma v6:sta. Kyseisestä asiasta on tehty PR https://github.com/lucia-auth/lucia/pull/1760 jos tuota ei ole korjattu helmikuuhun mennessä, korjataan itse tai keksitään jokin muu ratkaisu

`@types/node`a ei ole päivitetty, koska pitänee seurata package.json:in node-versiota

#########################################################################

**Testaa näitä päivittämisen yhteydessä**

- [] poista oma testaustietokanta ja lisää tietokanta uudelleen `npm run prisma db push`

- [] kokeile ESLint ettei heitä virheitä

- [] testaa sivu että normaalikäyttö toimii (rekistöröinti, kirjautuminen, lahjan (lisääminen, poistaminen, muokkaaminen), palaute)

- [] API-endpointtien testaaminen
