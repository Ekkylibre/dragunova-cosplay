export type Photo = {
  src: string;
  alt: string;
  serie: string;
  personnage: string;
  annee: string;
  /** Classes de placement dans la grille du book */
  span: string;
  /** Ratio d'affichage de la photo */
  ratio: string;
};

export const photos: Photo[] = [
  {
    src: "/photos/lucy.png",
    alt: "Cosplay de Lucy de Cyberpunk Edgerunners, ambiance néon urbaine",
    serie: "Néons",
    personnage: "Lucy · Edgerunners",
    annee: "2023",
    span: "md:col-span-5 md:row-span-2",
    ratio: "aspect-[3/4]",
  },
  {
    src: "/photos/ashe.png",
    alt: "Cosplay d'Ashe d'Overwatch, portrait studio au chapeau de cowboy",
    serie: "Far West",
    personnage: "Ashe · Overwatch",
    annee: "2019",
    span: "md:col-span-4",
    ratio: "aspect-[4/5]",
  },
  {
    src: "/photos/ayrenn.png",
    alt: "Cosplay de la Reine Ayrenn de The Elder Scrolls Online, armure bleue et or",
    serie: "Tamriel",
    personnage: "Reine Ayrenn · ESO",
    annee: "2023",
    span: "md:col-span-3",
    ratio: "aspect-[3/4]",
  },
  {
    src: "/photos/starfire.png",
    alt: "Cosplay de Starfire des Teen Titans, chevelure flamboyante sur fond vert",
    serie: "Comics",
    personnage: "Starfire · DC",
    annee: "2021",
    span: "md:col-span-3",
    ratio: "aspect-[3/4]",
  },
  {
    src: "/photos/beidou.png",
    alt: "Cosplay de Beidou de Genshin Impact, épée géante en forêt",
    serie: "Teyvat",
    personnage: "Beidou · Genshin Impact",
    annee: "2021",
    span: "md:col-span-7",
    ratio: "aspect-[16/10]",
  },
  {
    src: "/photos/black-widow.png",
    alt: "Cosplay de Black Widow, combinaison noire en extérieur",
    serie: "Comics",
    personnage: "Black Widow · Marvel",
    annee: "2020",
    span: "md:col-span-4",
    ratio: "aspect-[3/4]",
  },
  {
    src: "/photos/fallout.png",
    alt: "Cosplay en armure de cuir de Fallout 76, lumière verte nocturne",
    serie: "Terres désolées",
    personnage: "Vault Dweller · Fallout 76",
    annee: "2021",
    span: "md:col-span-4",
    ratio: "aspect-[4/5]",
  },
  {
    src: "/photos/elfe-teso.png",
    alt: "Cosplay original d'elfe de The Elder Scrolls Online, armure fabriquée main",
    serie: "Tamriel",
    personnage: "Elfe · TESO (création)",
    annee: "2023",
    span: "md:col-span-4",
    ratio: "aspect-[3/4]",
  },
];
