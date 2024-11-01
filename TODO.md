### <IDEOITA>

// pages/login.tsx

# jos: sähköposti ei ole sääntöjen mukainen && salasanan pituus <= 0 -> Kirjaudu-buttonin className="cursor-not-allowed hover:text-white"

# Rekistöröidessä kun rekistöröidy-painike on painettu -> tee napista semmoinen ettei voi painaa uudelleen / tee jonkinlainen latausindikaattori jotta käyttäjä tietää, että jotain tapahtuu. Tämä "ongelma" näkyy parhaiten Vercelin tarjoamassa testiympäristössä, jossa nopeudet eivät ole localhostin kaltaiset

# Ehkä jonkinlainen kysymys, että haluaako pysyä kirjautuneena kun session on loppumassa? Kuten julkisissapalveluissa (Kela, OmaKanta, Suomi.fi yms)

### </IDEOITA>

TODO:

Jos tulee virhe vaikka lahjoja hakiessa, ehkä jokin nappula olisi hyvä tehdä, jolla voisi mahdollisesti kokeilla hakea uudestaan lahjoja

Kun lisää uuden lahjan / kun lahjoja haetaan, järjestetään ne uusin -> vanhin. Myöhemmin voidaan lisätä käyttäjälle mahdollisuus valita miten lahjat haluaa järjestää (vaikka vanhin -> uusin, aakkosjärjestys, ymsyms)

Tässä toteutustapa:

const sortedArrayNewestToOldest = gifts.sort(
(a, b) =>
new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
);
