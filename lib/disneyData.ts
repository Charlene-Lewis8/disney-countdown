export interface DailySurprise {
    character: string;
    emoji: string;
    movie: string;
    greeting: string;
    dailyQuest: string;
    funFact: string;
    bgGradient: string;
}

export const DAILY_SURPRISES: DailySurprise[] = [
    {
        character: "Mickey Mouse",
        emoji: "🐭",
        movie: "Mickey & Friends",
        greeting: "Oh boy! Hot dog! You're one day closer to seeing me!",
        dailyQuest: "Do your biggest Mickey Mouse smile in the mirror today!",
        funFact: "Mickey's favorite snack at the parks is a Mickey-shaped ice cream bar!",
        bgGradient: "from-red-400 to-yellow-400",
    },
    {
        character: "Elsa & Olaf",
        emoji: "⛄",
        movie: "Frozen",
        greeting: "Hi! I'm Olaf and I like warm hugs!",
        dailyQuest: "Do a twirl and pretend to shoot sparkly ice magic from your hands!",
        funFact: "Olaf loves summer-and July in Disney is super sunny!",
        bgGradient: "from-cyan-400 to-blue-500",
    },
    {
        character: "Moana",
        emoji: "🌊",
        movie: "Moana",
        greeting: "The ocean chose you for a magical adventure!",
        dailyQuest: "Sing your favorite song as loud as you can today!",
        funFact: "HeiHei the rooster has a very tiny brain, so don't forget to pack your snacks!",
        bgGradient: "from-teal-400 to-emerald-500",
    },
    {
        character: "Stitch",
        emoji: "👽",
        movie: "Lilo & Stitch",
        greeting: "Aloha! Ohana means family, and we're going to Disney!",
        dailyQuest: "Make your funniest silly alien face for someone in your family!",
        funFact: "Stitch loves eating yummy Dole Whip pineapple treats!",
        bgGradient: "from-blue-500 to-indigo-500",
    },
    {
        character: "Rapunzel & Pascal",
        emoji: "🦎",
        movie: "Tangled",
        greeting: "Best. Day. Ever! Let's paint a picture of the castle!",
        dailyQuest: "Draw a picture of Cinderella Castle or your favorite princess!",
        funFact: "Look for hidden Pascals hiding near Rapunzel's tower in Magic Kingdom!",
        bgGradient: "from-purple-400 to-pink-500",
    },
    {
        character: "Simba",
        emoji: "🦁",
        movie: "The Lion King",
        greeting: "Hakuna Matata! No worries until Disney Day!",
        dailyQuest: "Let out your biggest, bravest lion ROAR!",
        funFact: "You can ride a real safari truck at Animal Kingdom to see real lions!",
        bgGradient: "from-amber-400 to-orange-500",
    },
    {
        character: "Tinker Bell",
        emoji: "🧚‍♀️",
        movie: "Peter Pan",
        greeting: "Think happy thoughts and sprinkle some pixie dust!",
        dailyQuest: "Jump as high as your can like your're flying to Neverland",
        funFact: "Tinker Bell flies right over the castle during the nighttime fireworks!",
        bgGradient: "from-lime-400 to-green-500",
    },
    {
        character: "Ariel",
        emoji: "🧜‍♀️",
        movie: "The Little Mermaid",
        greeting: "Flip your fins-you're going to be part of our world soon!",
        dailyQuest: "Do a silly mermaid wiggle dance for 10 seconds!",
        funFact: "You can ride inside a giant purple clamshell under the sea at Magic Kingdom!",
        bgGradient: "from-emerald-400 to-teal-500",
    },
    {
        character: "Buzz Lightyear",
        emoji: "🚀",
        movie: "Toy Story",
        greeting: "To Disney World....and BEYOND!",
        dailyQuest: "Practice your Space Ranger laser-blaster pose!",
        funFact: "In Toy Story Land, you shrink down to the size of a toy!",
        bgGradient: "from-indigo-400 to-purple-500",
    },
    {
        character: "Minnie Mouse",
        emoji: "🎀",
        movie: "Mickey & Friends",
        greeting: "Yoo-hoo! Don't forget to pack your sparkly ears!",
        dailyQuest: "Pick out your favorite colorful outfit to wear today!",
        funFact: "Minnie has over 200 different outfits and bows in her closet!",
        bgGradient: "from-pink-400 to-rose-500",
    },
];

export const PACKING_ITEMS = [
    { id: "ears", label: "Minnie Ears", emoji: "\u{1F380}" },
    { id: "autograph", label: "Autograph Book", emoji: "\u{1F4D6}" },
    { id: "sunscreen", label: "Sunscreen", emoji: "\u{1F9F4}" },
    { id: "sneakers", label: "Comfy Shoes", emoji: "\u{1F45F}" },
    { id: "water", label: "Water Bottle", emoji: "\u{1F964}" },
    { id: "plush", label: "Favorite Stuffed Animal", emoji: "\u{1F9F8}" },
];