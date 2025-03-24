### <IDEOITA>

// pages/login.tsx

# jos: sähköposti ei ole sääntöjen mukainen && salasanan pituus <= 0 -> Kirjaudu-buttonin className="cursor-not-allowed hover:text-white"

# Ehkä jonkinlainen kysymys, että haluaako pysyä kirjautuneena kun session on loppumassa? Kuten julkisissapalveluissa (Kela, OmaKanta, Suomi.fi yms)

# Jokin sivu (esimerkiksi asetuksiin), joka näyttää kaikki aktiiviset (miksei epäaktiiviset) Sessionit. Myöskin Sessionin poistomahdollisuus voitaisiin lisätä

# Enter-näppäimellä EditModalin (DONE) ja DeleteModalin hyväksyminen

# Kun lisää uuden lahjan / kun lahjoja haetaan, järjestetään ne uusin -> vanhin. Myöhemmin voidaan lisätä käyttäjälle mahdollisuus valita miten lahjat haluaa järjestää (vaikka vanhin -> uusin, aakkosjärjestys, ymsyms)

# Tässä toteutustapa:const sortedArrayNewestToOldest = gifts.sort((a, b) =>new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),);

# Tanstackin requesteihin joku maksimiaika mitä odotetaan

# Lisätään nappula, jolla voi hakea lahjat uudelleen halutessaan. Esimerkiksi jos tulee virhe lahjoja noutaessa, voisi haun laittaa uudelleen. Tai jos esimerkiksi lahjan poistaminen ei onnistu, koska lahjaa ei löydy palvelimelta. Ei käyttäjä voi ladata lahjoja uudelleen ilman sivun uudelleen latausta / F5

# Jos käyttäjä ohjataan kirjautumissivulle, tallennetaan sijainti mistä käyttäjä tuotiin kirjautumissivulle. Mahdollisesti jotain seuraavaa http://localhost:3000/login?redirect=/

### </IDEOITA>

TODO:

1. Tee https://github.com/samuliasmala/lahjalista/pull/62#discussion_r1921024704 omaan branchiin

2.1 Vaihda "Kirjaudu sisään"- ja "Luo käyttäjätunnus" -nappuloihin pyörivä spinner-indikaattori "..." sijaan
2.2 Lisää /pages/login.tsx:n Kirjaudu sisään -nappulaan "select-none" jottei teksti tule maalatuksi jos silmää painaa muutaman kerran liian nopeasti

3. Tee https://github.com/samuliasmala/lahjalista/pull/63/files/6cc43a4562191ceb6c29b6c42059e8e750ed575d#r1921036461 omaan branchiin

4. Vaihda /shared/zodSchemas.ts:ssä olevat uuid-tarkistukset käyttämään nykyistä uuidParseSchema-skeemaa. Esimerkiksi:

```ts
export const giftSchema = z.object({
  gift: z.string().min(1),
  receiver: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  uuid: z.string(),
});

// -------->

export const giftSchema = z.object({
  gift: z.string().min(1),
  receiver: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  uuid: uuidParseSchema,
});
```
