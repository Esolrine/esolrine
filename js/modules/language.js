export class LanguageManager {
    constructor() {
        this.currentLanguage = 'fr';
        this.supportedLanguages = ['fr', 'en'];
        this.isMobile = this.detectMobile();

        // Traductions
        this.translations = {
            fr: {
                stories: {
                    1: {
                        title: "Je suis impuissante",
                        text: "Elle se trouvait à terre, couvée entre les ronces d'un buisson. Sa stature ainsi que son apparence étaient malpropres, ternis d'éraflures et de boue. Son regard ne se distrayait pas de la cible abstraite devant elle, et sa bouche entrouverte paraissait en suspens. Je me suis trouvée stupéfaite qu'elle n'entreprit pas de faire l'effort de se dignifier, surtout lorsqu'elle fut sujet à ma présence. Elle m'a tant accoutumée à ne pas négliger mes étiquettes que d'être témoin de son laxisme était presque ironique. Cela ne m'a pas convenu.\n" +
                            "J'approchai de nouveau et pris sa main, terriblement froide. Son battement cardiaque était quasiment indiscernable, comme sa respiration. C'est à ce moment que j'ai remarqué l'expression lourde, faible, fatiguée de son visage. Elle ne semblait pas vouloir persister à vivre. Sans mon accord. J'ai refusé. Je l'ai prise par le bras pour la relever qu'elle tomba sur ses genoux. Avait-elle oublié la promesse qu'elle m'avait faite, de ne pas se considérer soumise ?\n" +
                            "Je me suis ajustée à sa hauteur pour l'entendre murmurer la tête baissée. Ses paroles s'adressaient à moi. Des paroles si sottes. Si futiles. Je l'ai enlacée dans mes bras, et entrepris de lui partager mon █████. Elle se mit à luire. Rapidement, son visage ainsi que les extrémités de ses doigts se mirent à saigner, son corps n'était pas suffisamment puissant pour être compatible. J'ai arrêté immédiatement le processus. Elle succomba à la gravité et tomba sur le côté.\n" +
                            "Elle ne m'a pas répondu lorsque je l'ai appelée. Elle ne m'a pas obéi lorsque je lui ai ordonné d'ouvrir les yeux. Elle n'a pas réagi lorsque je l'ai secouée. Elle n'a pas bronché lorsque je l'ai frappée au visage. Elle n'a même pas pris la peine d'essuyer les larmes qui tombaient sur ses joues.\n" +
                            "Je suis impuissante face à la mortalité.\n"
                    },
                    2: {
                        title: "Convives",
                        text: "De nouveau seule, j'entendis les pas de l'organisatrice s'éloigner, progressivement noyés dans les rires et conversations enjouées du couloir. Mon attention se redirigea vers toutes les fleurs que mes convives m'avaient apportées aujourd'hui. Ils m'en avaient tellement offert ! Pourquoi ne pas me les donner tout au long de l'année, que je puisse profiter de chaque plante individuellement plutôt que de me les donner toutes au même moment ? Deux enfants rentrèrent alors dans la pièce, perdus, et prirent immédiatement conscience de leur faux-pas. À peine eurent-ils le temps de s'excuser que les pas de l'organisatrice, lourds cette fois-ci, se rapprochèrent dangereusement. Paniqué, le garçon décida de se cacher derrière moi, faute de meilleur refuge. La fille, hésitante, resta figée sur place en me regardant l'air inquiet. Le garçon prit sa main et l'emmena vers sa cachette lorsque l'organisatrice rentra poliment dans la pièce.\n" +
                            "Elle scruta la pièce d'un coup d'œil expert, puis s'excusa de son intrusion soudaine et partit. L'ampleur de ma robe n'eut aucun mal à dissimuler les deux fugitifs. Une fois partie pour de bon, les enfants et moi-même nous mîmes à rigoler. Je leur ai alors expliqué qu'ils n'avaient pas la permission de rester ici, mais dans un élan de nourrir l'esprit de complicité je pris une fleur de mon bouquet et la leur offris. La Lépida avait une forme ressemblant à un papillon, et symbolisait le bonheur que l'on trouve dans les instants éphémères. La jeune fille prit la fleur de mes mains et m'offrit en retour un grand sourire. Légère, elle se tourna vers le garçon et lui tendit mon cadeau, sans doute pour récompenser son héroïsme. Son visage vira au rouge, puis il prit la tige de la fleur avec timidité. Il baissa la tête et, non pas sans un regard lancé à la fille, il nous tourna le dos pour examiner la plante. \n" +
                            "Elle prit alors sa main et se dirigea vers la porte. Elle me fit un grand geste de son bras et sortit de la pièce. Quant au garçon qu'elle emmenait avec elle, il était trop préoccupé par ce qu'il tenait pour me saluer. La porte se referma et le calme reprit sa place pendant quelques minutes, avant que l'on ne toque à la porte. Je pris mon bouquet et sortis de la pièce.\n"
                    },
                    3: {
                        title: "Pour mon enfant",
                        text: "Les bruits de pas sur la pierre rythmaient mon ascension de l'escalier tourbillonnant. Crescendo, le crépitement de la cheminée me parvenait lorsque la porte s'ouvrit en tonnerre. Un cri s'échappa de mon épouse avant qu'elle ne soit étouffée par la stupeur. Sugistain essaya de faire usage de ma puissance, mais je refusai. Agacé, il prit une bouteille du comptoir et la brisa sur le coin du meuble. Le murmure du brasier de nouveau interrompu, ma femme me lança un dernier regard avant de s'éclipser de la pièce. Ses yeux m'ont parlé de ses craintes, peurs et appréhensions. Son désespoir m'implora d'intervenir. J'ordonnai à Sugistain de freiner sa frénésie, mais il ne m'écouta pas.\n" +
                            "Il abandonna la mélodie du feu pour chasser Uthopa dans le foyer. Il l'attrapa par le cou et logea son arme dans son ventre. J'ai juré, j'ai crié, mais il n'a pas lâché prise. Après une longue pause, elle s'effondra sur le sol, muette. Je n'ai pu qu'assister à la scène, et sans prendre le temps de comprendre son silence, je repartis dans le salon. Je n'entendais ni le bruit de ses pas ni le chant des flammes, mais que le vacarme sanguin de son rythme cardiaque assourdissant. Au moment où Sugistain se dirigea vers l'étage supérieur, je compris ses intentions les plus sinistres. Il allait s'en prendre à ma fille.\n" +
                            "J'ai utilisé mon █████ pour tenter de l'arrêter. J'ai aussi sous-estimé le contrôle qu'il pouvait exercer sur moi et mes capacités. Utilisant ma force, il prit de la vitesse et enfonça la porte verrouillée de la chambre de mon enfant. Je me mis à me saigner de son corps, affrontant son contrôle par ma volonté. Ma détermination fit flancher son pouvoir, il lâcha prise, et je parvins à m'extirper de lui. Maintenant mes mains autour de son cou, je sentis son pouls traître pulser sous mes doigts. Il battit fort, voulant lui aussi se libérer de cette emprise. Je ne faiblis pas, et lentement, il se calma, avant de sombrer dans un sommeil éternel.\n" +
                            "Je pris connaissance de mes alentours pour découvrir la fenêtre, béante, donnant sur la plus belle vue de Solstice que la vie peut s'offrir. Orpheline, le sang de Sugistain semblait encore me traverser.\n"
                    },
                    4: {
                        title: "Célesticide",
                        text: "\n" +
                            "Ses jambes la lâchèrent, et la créature percuta le sol. Meurtrie et sans doute épuisée, son état ne semblait pas la préoccuper dans sa course. Elle rampa lentement vers sa mort, animée uniquement par son désir de destruction. Je finis par l'achever et poursuivis l'exploration de leur antre. Les cristaux d'█████ permettaient de se frayer un chemin aisément parmi les roches et autres obstacles qui seraient tombés du plafond de la grotte. Au fur et à mesure de mon avancée, les prismes de lumière devenaient de plus en plus fréquents. Je découvris éventuellement un immense lac souterrain. L'eau était bleue phosphorescente, et de petits morceaux de cristaux flottaient en surface. Elle restait cependant translucide, et je pouvais distinguer des gisements de cristaux au fond du bassin. La plupart semblaient… brisés.\n" +
                            "Soudain, la cave se mit à vibrer violemment. Le plafond se fissura au-dessus de ma tête. Je tournai rapidement mes talons et entamai mon ascension vers la surface. Je me frayai un chemin parmi les créatures de boue et de prismes que j'ai abattues lors de ma descente pour me retrouver en quelques minutes à l'entrée de la grotte. À mon arrivée, Ajiia me sauta dans les bras. Son visage était gonflé par ses pleurs, mais je m'efforçai de me focaliser sur la situation. Je levai la tête. Les nuages appartenant avant aux cieux ont été perforés par mes semblables. Le Célesticide avait déjà commencé.\n" +
                            "J'ai pris Ajiia dans mes bras et courus vers Tholomes. Le ciel avait viré au bleu lumineux, et l'air était devenu condensé. Elle se mit à tousser violemment, et je sus que je ne pouvais pas lui venir en aide. Je découvris alors l'état de la capitale après avoir passé la colline de Rochefaç. Je ne pouvais qu'en voir les contours, la ville était submergée par la lumière obnubilante des atherarchs. Un frisson, puis un froid paralysant me parcourut le corps. Je n'étais plus l'un des leurs, car je ne pouvais pas les comprendre. Cela signifiait également que j'étais leur ennemi… leur cible. Je suis resté encore un moment à regarder le spectacle sinistre se déroulant devant mes yeux, incapable de me projeter dans mon destin. Je repris Ajiia dans mes bras et pris la fuite, loin du conflit.\n" +
                            "\n"
                    },
                    5: {
                        title: "Mon █████",
                        text: "Par endroits, sa peau était couverte d'écailles. Elle avait les traits jeunes d'un enfant, et était constituée approximativement comme un humain. Des petites cornes décoraient ses longs cheveux nacrés, avec des oreilles tirées vers le haut de part et d'autre de sa tête. Sans oublier, dans son dos, une petite paire d'ailes venues de très loin. Quant à ses yeux, je ne l'ai pas su. Ils étaient fermés. \n" +
                            "Je repensai à mes années vécues parmi les vivants. Des images, lieux, mémoires et sensations peignaient mon esprit. Un tableau apparut alors, colorié par les mille pinceaux que j'ai eu le privilège de manier au cours de mon temps parmi eux. Rouge sang, jaune tournesol, vert taupe, rose ruban, bleu océan, blanc sourire. Chaque mémoire imbibée de la sagesse des mortels venait participer à la création de cette toile. Chaque nuance avait un sens irréfutable, mais aucun n'était explicable. Cette œuvre, compilation de milliers d'années de vécues, peuples et races confondus, je lui en ai fait don. Je lui ai offert sa mortalité.\n" +
                            "Doux comme une caresse, puis voyageur, puis tourbillonnant, mon █████ la porta au centre de la pièce. Peu à peu, il s'appropria l'espace et se concrétisa dans la matière. Elle, sage, se laissa porter par les courants célestes. Tel une chrysalide, ce cocon se forma lentement autour d'elle avec la plus grande délicatesse pour son hôte. Des instants passèrent, et un cristal bleu luminescent finit par la recouvrir. Les préparatifs pour le processus d'incubation achevés, et son essence protégée par ma puissance, une seule pensée m'occupait alors l'esprit : l'espoir, la certitude de la voir à nouveau, de plonger mon regard dans le sien et d'y voir sa mortalité. Seulement à ce moment-là, nous pourrons créer un avenir nouveau.\n" +
                            "\n"
                    },
                    athulan: {
                        title: "█████",
                        text: this.isMobile ? "What is █████ ?" : "̺̾W̴̤̋ȟ̴̫á̸̺t̷̖̿ ̴̘͆î̸̦s̷̩̀ ̴̪͑█̴͔̍█̸̞͒█̸̙͌█̵̘̈́█̷̗̌ ̵̰͝?̸̱͌"
                    }
                },
                ui: {
                    musicPrompt: "🎵 Cliquez n'importe où pour démarrer la musique",
                    athulanMessage: "..."
                }
            },
            en: {
                stories: {
                    1: {
                        title: "I am powerless",
                        text: "She lay on the ground, nestled among the thorns of a bush. Her stature and appearance were disheveled, tarnished with scratches and mud. Her gaze did not stray from the abstract target before her, and her half-open mouth seemed suspended. I found myself astonished that she did not make the effort to dignify herself, especially when she became aware of my presence. She had so accustomed me to not neglecting my etiquette that witnessing her laxity was almost ironic. It did not suit me.\n" +
                            "I approached again and took her hand, terribly cold. Her heartbeat was barely discernible, like her breathing. It was at that moment that I noticed the heavy, weak, tired expression on her face. She did not seem to want to persist in living. Without my consent. I refused. I took her by the arm to lift her up only for her to fall to her knees. Had she forgotten the promise she had made to me, not to consider herself submissive?\n" +
                            "I adjusted myself to her height to hear her murmur with her head down. Her words were addressed to me. Words so foolish. So futile. I embraced her in my arms, and undertook to share my █████ with her. She began to glow. Quickly, her face and fingertips began to bleed, her body was not powerful enough to be compatible. I immediately stopped the process. She succumbed to gravity and fell to the side.\n" +
                            "She did not answer me when I called her. She did not obey me when I ordered her to open her eyes. She did not react when I shook her. She did not flinch when I slapped her face. She did not even bother to wipe the tears falling on her cheeks.\n" +
                            "I am powerless against mortality.\n"
                    },
                    2: {
                        title: "Guests",
                        text: "Alone again, I heard the organizer's footsteps fade away, gradually drowned in the laughter and cheerful conversations of the corridor. My attention redirected to all the flowers my guests had brought me today. They had offered me so many! Why not give them to me throughout the year, so I could enjoy each plant individually rather than giving them all at the same time? Two children then entered the room, lost, and immediately became aware of their misstep. They barely had time to apologize when the organizer's footsteps, heavy this time, approached dangerously. Panicked, the boy decided to hide behind me, for lack of a better refuge. The girl, hesitant, remained frozen in place looking at me worriedly. The boy took her hand and led her to his hiding place when the organizer politely entered the room.\n" +
                            "She scanned the room with an expert glance, then apologized for her sudden intrusion and left. The fullness of my dress had no trouble concealing the two fugitives. Once she was gone for good, the children and I began to giggle. I then explained to them that they did not have permission to stay here, but in a spirit of nurturing complicity I took a flower from my bouquet and offered it to them. The Lepida had a shape resembling a butterfly, and symbolized the happiness found in ephemeral moments. The young girl took the flower from my hands and offered me a big smile in return. Light, she turned to the boy and handed him my gift, no doubt to reward his heroism. His face turned red, then he took the stem of the flower with shyness. He lowered his head and, not without a glance at the girl, turned his back to us to examine the plant.\n" +
                            "She then took his hand and headed for the door. She waved her arm at me and left the room. As for the boy she was taking with her, he was too preoccupied with what he was holding to greet me. The door closed and calm resumed for a few minutes, before there was a knock at the door. I took my bouquet and left the room.\n"
                    },
                    3: {
                        title: "For my child",
                        text: "The sound of footsteps on stone punctuated my ascent of the spiral staircase. Crescendo, the crackling of the fireplace reached me when the door opened with a thunder. A cry escaped from my wife before she was stifled by stupor. Sugistain tried to use my power, but I refused. Annoyed, he took a bottle from the counter and broke it on the corner of the furniture. The whisper of the blaze interrupted again, my wife gave me one last look before disappearing from the room. Her eyes spoke to me of her fears, terrors and apprehensions. Her despair implored me to intervene. I ordered Sugistain to curb his frenzy, but he did not listen to me.\n" +
                            "He abandoned the melody of fire to chase Uthopa into the hearth. He grabbed her by the neck and lodged his weapon in her belly. I swore, I screamed, but he did not let go. After a long pause, she collapsed on the floor, mute. I could only watch the scene, and without taking time to understand her silence, I returned to the living room. I heard neither the sound of her footsteps nor the song of the flames, but only the bloody din of her deafening heartbeat. The moment Sugistain headed for the upper floor, I understood his most sinister intentions. He was going to attack my daughter.\n" +
                            "I used my █████ to try to stop him. I also underestimated the control he could exert over me and my abilities. Using my strength, he gained speed and broke down the locked door of my child's room. I began to bleed from his body, confronting his control with my will. My determination made his power falter, he let go, and I managed to extricate myself from him. Now my hands around his neck, I felt his treacherous pulse beat under my fingers. It beat hard, also wanting to free itself from this grip. I did not weaken, and slowly, it calmed, before sinking into an eternal sleep.\n" +
                            "I took stock of my surroundings to discover the window, gaping, giving the most beautiful view of Solstice that life can afford. Orphaned, Sugistain's blood still seemed to run through me.\n"
                    },
                    4: {
                        title: "Celesticide",
                        text: "\n" +
                            "Her legs gave out, and the creature hit the ground. Bruised and no doubt exhausted, her condition did not seem to concern her in her race. She crawled slowly towards her death, animated only by her desire for destruction. I finished her off and continued exploring their lair. The █████ crystals made it easy to make way through the rocks and other obstacles that would have fallen from the cave ceiling. As I progressed, the prisms of light became more and more frequent. I eventually discovered a huge underground lake. The water was phosphorescent blue, and small pieces of crystals floated on the surface. It remained translucent, however, and I could make out crystal deposits at the bottom of the basin. Most seemed... broken.\n" +
                            "Suddenly, the cave began to vibrate violently. The ceiling cracked above my head. I quickly turned on my heels and began my ascent to the surface. I made my way through the mud and prism creatures I had killed during my descent to find myself at the cave entrance in a few minutes. Upon my arrival, Ajiia jumped into my arms. Her face was swollen from crying, but I forced myself to focus on the situation. I looked up. The clouds that once belonged to the heavens had been perforated by my kind. The Celesticide had already begun.\n" +
                            "I took Ajiia in my arms and ran towards Tholomes. The sky had turned bright blue, and the air had become condensed. She began to cough violently, and I knew I could not help her. I then discovered the state of the capital after passing the Rochefaç hill. I could only see its outlines, the city was submerged by the blinding light of the atherarchs. A shiver, then a paralyzing cold ran through my body. I was no longer one of them, for I could not understand them. This also meant that I was their enemy... their target. I remained for a moment longer watching the sinister spectacle unfolding before my eyes, unable to project myself into my destiny. I took Ajiia back in my arms and fled, far from the conflict.\n" +
                            "\n"
                    },
                    5: {
                        title: "My █████",
                        text: "In places, her skin was covered with scales. She had the young features of a child, and was built approximately like a human. Small horns decorated her long pearly hair, with ears pulled upward on either side of her head. Not to mention, on her back, a small pair of wings from far away. As for her eyes, I did not know. They were closed.\n" +
                            "I thought back to my years lived among the living. Images, places, memories and sensations painted my mind. A painting then appeared, colored by the thousand brushes I had the privilege of wielding during my time among them. Blood red, sunflower yellow, taupe green, ribbon pink, ocean blue, smile white. Each memory imbued with the wisdom of mortals came to participate in the creation of this canvas. Each nuance had an irrefutable meaning, but none was explicable. This work, a compilation of thousands of years of experience, peoples and races combined, I gave it to her. I offered her her mortality.\n" +
                            "Gentle as a caress, then traveling, then swirling, my █████ carried her to the center of the room. Little by little, it appropriated the space and materialized in matter. She, wise, let herself be carried by the celestial currents. Like a chrysalis, this cocoon slowly formed around her with the greatest delicacy for its host. Moments passed, and a luminescent blue crystal finally covered her. The preparations for the incubation process completed, and her essence protected by my power, only one thought occupied my mind: hope, the certainty of seeing her again, of plunging my gaze into hers and seeing her mortality. Only then can we create a new future.\n" +
                            "\n"
                    },
                    athulan: {
                        title: "█████",
                        text: this.isMobile ? "What is █████ ?" : "̺̾W̴̤̋ȟ̴̫á̸̺t̷̖̿ ̴̘͆î̸̦s̷̩̀ ̴̪͑█̴͔̍█̸̞͒█̸̙͌█̵̘̈́█̷̗̌ ̵̰͝?̸̱͌"
                    }
                },
                ui: {
                    musicPrompt: "🎵 Click anywhere to start the music",
                    athulanMessage: "The gateway reveals itself to those who know the name..."
                }
            }
        };

        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }

    init() {
        this.detectLanguage();
        this.setupLanguageObserver();
        
        // Détecter les changements de taille d'écran
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = this.detectMobile();
            
            // Si on change de mobile à desktop ou vice versa, mettre à jour les textes
            if (wasMobile !== this.isMobile) {
                this.updateAthulanText();
            }
        });
    }

    updateAthulanText() {
        // Mettre à jour le texte Athulan selon le type d'appareil
        const athulanText = this.isMobile ? "What is █████ ?" : "̺̾W̴̤̋ȟ̴̫á̸̺t̷̖̿ ̴̘͆î̸̦s̷̩̀ ̴̪͑█̴͔̍█̸̞͒█̸̙͌█̵̘̈́█̷̗̌ ̵̰͝?̸̱͌";
        
        this.translations.fr.stories.athulan.text = athulanText;
        this.translations.en.stories.athulan.text = athulanText;
        
        // Émettre un événement pour signaler le changement
        window.dispatchEvent(new CustomEvent('athulanTextUpdated', { detail: { isMobile: this.isMobile } }));
    }

    detectLanguage() {
        // Vérifier d'abord localStorage
        const savedLang = localStorage.getItem('esolrine-language');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
            return;
        }

        // Vérifier l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.supportedLanguages.includes(urlLang)) {
            this.currentLanguage = urlLang;
            this.saveLanguage(urlLang);
            return;
        }

        // Détecter depuis le navigateur
        const browserLang = navigator.language.slice(0, 2);
        if (this.supportedLanguages.includes(browserLang)) {
            this.currentLanguage = browserLang;
        } else {
            this.currentLanguage = 'fr'; // Défaut
        }

        this.saveLanguage(this.currentLanguage);
    }

    setupLanguageObserver() {
        // Observer pour les changements d'URL
        window.addEventListener('popstate', () => {
            this.detectLanguage();
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: this.currentLanguage }));
        });
    }

    saveLanguage(lang) {
        localStorage.setItem('esolrine-language', lang);
    }

    setLanguage(lang) {
        if (this.supportedLanguages.includes(lang)) {
            this.currentLanguage = lang;
            this.saveLanguage(lang);
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
        }
    }

    getStory(zoneNumber) {
        return this.translations[this.currentLanguage].stories[zoneNumber] ||
            this.translations['fr'].stories[zoneNumber];
    }

    getText(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        for (const k of keys) {
            value = value[k];
            if (!value) {
                // Fallback to French
                value = this.translations['fr'];
                for (const k2 of keys) {
                    value = value[k2];
                    if (!value) break;
                }
                break;
            }
        }

        return value || key;
    }
}
