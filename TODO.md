### <IDEOITA>

// pages/login.tsx

# jos: sähköposti ei ole sääntöjen mukainen && salasanan pituus <= 0 -> Kirjaudu-buttonin className="cursor-not-allowed hover:text-white"

# Ehkä jonkinlainen kysymys, että haluaako pysyä kirjautuneena kun session on loppumassa? Kuten julkisissapalveluissa (Kela, OmaKanta, Suomi.fi yms)

# Jokin sivu (esimerkiksi asetuksiin), joka näyttää kaikki aktiiviset (miksei epäaktiiviset) Sessionit. Myöskin Sessionin poistomahdollisuus voitaisiin lisätä

# Enter-näppäimellä EditModalin (DONE) ja DeleteModalin hyväksyminen

### </IDEOITA>

TODO:

Jos tulee virhe vaikka lahjoja hakiessa, ehkä jokin nappula olisi hyvä tehdä, jolla voisi mahdollisesti kokeilla hakea uudestaan lahjoja

Kun lisää uuden lahjan / kun lahjoja haetaan, järjestetään ne uusin -> vanhin. Myöhemmin voidaan lisätä käyttäjälle mahdollisuus valita miten lahjat haluaa järjestää (vaikka vanhin -> uusin, aakkosjärjestys, ymsyms)

Tässä toteutustapa:

const sortedArrayNewestToOldest = gifts.sort(
(a, b) =>
new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
);
