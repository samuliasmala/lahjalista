### <IDEOITA>

// pages/login.tsx

# jos: sähköposti ei ole sääntöjen mukainen && salasanan pituus <= 0 -> Kirjaudu-buttonin className="cursor-not-allowed hover:text-white"

# Ehkä jonkinlainen kysymys, että haluaako pysyä kirjautuneena kun session on loppumassa? Kuten julkisissapalveluissa (Kela, OmaKanta, Suomi.fi yms)

# Jokin sivu (esimerkiksi asetuksiin), joka näyttää kaikki aktiiviset (miksei epäaktiiviset) Sessionit. Myöskin Sessionin poistomahdollisuus voitaisiin lisätä

# Enter-näppäimellä EditModalin ja DeleteModalin hyväksyminen

### </IDEOITA>

TODO:

Lisää /pages/login.tsx:n Kirjaudu sisään -nappulaan "select-none" jottei teksti tule maalatuksi jos silmää painaa muutaman kerran liian nopeasti

Jos tulee virhe vaikka lahjoja hakiessa, ehkä jokin nappula olisi hyvä tehdä, jolla voisi mahdollisesti kokeilla hakea uudestaan lahjoja

Kun lisää uuden lahjan / kun lahjoja haetaan, järjestetään ne uusin -> vanhin. Myöhemmin voidaan lisätä käyttäjälle mahdollisuus valita miten lahjat haluaa järjestää (vaikka vanhin -> uusin, aakkosjärjestys, ymsyms)

Tässä toteutustapa:

const sortedArrayNewestToOldest = gifts.sort(
(a, b) =>
new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
);

Kysymys: Jos palvelin on hitaalla käyttäjä pystyy poistumaan EditModal tai DeleteModalista ennen kuin kyseinen toimenpide on toteutunut. Olisiko parempi lisätä requestille maksimiaika kuinka kauan odotetaan vastausta. Requestin ajan käyttäjä ei voisi sulkea Modalia

CHECK THIS: onClick funktio vs oma funktio esim. handleEdit(). Katso DeleteModal.tsx vs EditModal.tsx
