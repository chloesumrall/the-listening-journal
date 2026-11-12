// The Listening Journal — artist + discography data.
// Each artist has albums; each album has an accent color, optional section
// dividers ({ trackNumber: 'Label' }), and an ordered track list.

const TAYLOR_ALBUMS = [
  { id: 'debut', name: 'Taylor Swift', accent: '#1f7a78', tracks: [
    'Tim McGraw', 'Picture to Burn', 'Teardrops on My Guitar', 'A Place in This World', 'Cold as You', 'The Outside', 'Tied Together with a Smile', 'Stay Beautiful', 'Should’ve Said No', 'Mary’s Song (Oh My My My)', 'Our Song'] },
  { id: 'fearless', name: 'Fearless', accent: '#b58a1f', dividers: { 14: 'From the Vault · Taylor’s Version', 20: 'Platinum Edition' }, tracks: [
    'Fearless', 'Fifteen', 'Love Story', 'Hey Stephen', 'White Horse', 'You Belong with Me', 'Breathe', 'Tell Me Why', 'You’re Not Sorry', 'The Way I Loved You', 'Forever & Always', 'The Best Day', 'Change',
    'You All Over Me', 'Mr. Perfectly Fine', 'We Were Happy', 'That’s When', 'Don’t You', 'Bye Bye Baby',
    'Jump Then Fall', 'Untouchable', 'Come In with the Rain', 'Superstar', 'The Other Side of the Door', 'Today Was a Fairytale'] },
  { id: 'speaknow', name: 'Speak Now', accent: '#6b4e9e', dividers: { 15: 'From the Vault · Taylor’s Version', 21: 'Deluxe Edition' }, tracks: [
    'Mine', 'Sparks Fly', 'Back to December', 'Speak Now', 'Dear John', 'Mean', 'The Story of Us', 'Never Grow Up', 'Enchanted', 'Better than Revenge', 'Innocent', 'Haunted', 'Last Kiss', 'Long Live',
    'Electric Touch', 'When Emma Falls in Love', 'I Can See You', 'Castles Crumbling', 'Foolish One', 'Timeless',
    'Ours', 'If This Was a Movie', 'Superman'] },
  { id: 'red', name: 'Red', accent: '#a83a2c', dividers: { 17: 'From the Vault · Taylor’s Version', 26: 'Deluxe Edition' }, tracks: [
    'State of Grace', 'Red', 'Treacherous', 'I Knew You Were Trouble', 'All Too Well', '22', 'I Almost Do', 'We Are Never Ever Getting Back Together', 'Stay Stay Stay', 'The Last Time', 'Holy Ground', 'Sad Beautiful Tragic', 'The Lucky One', 'Everything Has Changed', 'Starlight', 'Begin Again',
    'Better Man', 'Nothing New', 'Babe', 'Message in a Bottle', 'I Bet You Think About Me', 'Forever Winter', 'Run', 'The Very First Night', 'All Too Well (10 Minute Version)',
    'The Moment I Knew', 'Come Back… Be Here', 'Girl at Home'] },
  { id: '1989', name: '1989', accent: '#3f7ba0', dividers: { 14: 'From the Vault · Taylor’s Version' }, tracks: [
    'Welcome to New York', 'Blank Space', 'Style', 'Out of the Woods', 'All You Had to Do Was Stay', 'Shake It Off', 'I Wish You Would', 'Bad Blood', 'Wildest Dreams', 'How You Get the Girl', 'This Love', 'I Know Places', 'Clean',
    '“Slut!”', 'Say Don’t Go', 'Now That We Don’t Talk', 'Suburban Legends', 'Is It Over Now?'] },
  { id: 'rep', name: 'reputation', accent: '#2a2a2a', tracks: [
    '…Ready for It?', 'End Game', 'I Did Something Bad', 'Don’t Blame Me', 'Delicate', 'Look What You Made Me Do', 'So It Goes…', 'Gorgeous', 'Getaway Car', 'King of My Heart', 'Dancing with Our Hands Tied', 'Dress', 'This Is Why We Can’t Have Nice Things', 'Call It What You Want', 'New Year’s Day'] },
  { id: 'lover', name: 'Lover', accent: '#a23a63', tracks: [
    'I Forgot That You Existed', 'Cruel Summer', 'Lover', 'The Man', 'The Archer', 'I Think He Knows', 'Miss Americana & the Heartbreak Prince', 'Paper Rings', 'Cornelia Street', 'Death by a Thousand Cuts', 'London Boy', 'Soon You’ll Get Better', 'False God', 'You Need to Calm Down', 'Afterglow', 'ME!', 'It’s Nice to Have a Friend', 'Daylight'] },
  { id: 'folklore', name: 'folklore', accent: '#5c6259', dividers: { 17: 'Bonus Track' }, tracks: [
    'the 1', 'cardigan', 'the last great american dynasty', 'exile', 'my tears ricochet', 'mirrorball', 'seven', 'august', 'this is me trying', 'illicit affairs', 'invisible string', 'mad woman', 'epiphany', 'betty', 'peace', 'hoax',
    'the lakes'] },
  { id: 'evermore', name: 'evermore', accent: '#a5552d', dividers: { 16: 'Bonus Tracks · Deluxe' }, tracks: [
    'willow', 'champagne problems', 'gold rush', '’tis the damn season', 'tolerate it', 'no body, no crime', 'happiness', 'dorothea', 'coney island', 'ivy', 'cowboy like me', 'long story short', 'marjorie', 'closure', 'evermore',
    'right where you left me', 'it’s time to go'] },
  { id: 'midnights', name: 'Midnights', accent: '#5a5b8c', dividers: { 14: '3am Edition', 21: 'The Late Night Edition' }, tracks: [
    'Lavender Haze', 'Maroon', 'Anti-Hero', 'Snow on the Beach', 'You’re on Your Own, Kid', 'Midnight Rain', 'Question…?', 'Vigilante Shit', 'Bejeweled', 'Labyrinth', 'Karma', 'Sweet Nothing', 'Mastermind',
    'The Great War', 'Bigger Than the Whole Sky', 'Paris', 'High Infidelity', 'Glitch', 'Would’ve, Could’ve, Should’ve', 'Dear Reader',
    'You’re Losing Me'] },
  { id: 'ttpd', name: 'The Tortured Poets Department', accent: '#4a4a45', dividers: { 17: 'The Anthology' }, tracks: [
    'Fortnight', 'The Tortured Poets Department', 'My Boy Only Breaks His Favorite Toys', 'Down Bad', 'So Long, London', 'But Daddy I Love Him', 'Fresh Out the Slammer', 'Florida!!!', 'Guilty as Sin?', 'Who’s Afraid of Little Old Me?', 'I Can Fix Him (No Really I Can)', 'loml', 'I Can Do It with a Broken Heart', 'The Smallest Man Who Ever Lived', 'The Alchemy', 'Clara Bow',
    'The Black Dog', 'imgonnagetyouback', 'The Albatross', 'Chloe or Sam or Sophia or Marcus', 'How Did It End?', 'So High School', 'I Hate It Here', 'thanK you aIMee', 'I Look in People’s Windows', 'The Prophecy', 'Cassandra', 'Peter', 'The Bolter', 'Robin', 'The Manuscript'] },
  { id: 'showgirl', name: 'The Life of a Showgirl', accent: '#d15a2a', tracks: [
    'The Fate of Ophelia', 'Elizabeth Taylor', 'Opalite', 'Father Figure', 'Eldest Daughter', 'Ruin the Friendship', 'Actually Romantic', 'Wi$h Li$t', 'Wood', 'CANCELLED!', 'Honey', 'The Life of a Showgirl'] },
];

const NOAH_ALBUMS = [
  { id: 'busyhead', name: 'Busyhead', accent: '#6b8e5a', tracks: [
    'False Confidence', 'Mess', 'Hurt Somebody', 'Young Blood', 'Busyhead', 'Cynic', 'Save Me', 'Sink', 'Tidal', 'Carlo’s Song'] },
  { id: 'iwasiam', name: 'I Was / I Am', accent: '#3f6b4f', tracks: [
    'Part of Me', 'Animal', 'Caves', 'Bad Luck', 'Godlight', 'Someone Like You', 'Fear of Water', 'Hollow', 'Bury Me', 'Howling'] },
  { id: 'stickseason', name: 'Stick Season', accent: '#b5733a', dividers: { 15: 'We’ll All Be Here Forever' }, tracks: [
    'Northern Attitude', 'Stick Season', 'All My Love', 'She Calls Me Back', 'Come Over', 'New Perspective', 'Everywhere, Everything', 'Orange Juice', 'Strawberry Wine', 'Growing Sideways', 'Halloween', 'Homesick', 'Still', 'The View Between Villages',
    'Your Needs, My Needs', 'Dial Drunk', 'Paul Revere', 'No Complaints', 'Call Your Mom', 'You’re Gonna Go Far', 'The View Between Villages (Extended)'] },
  { id: 'greatdivide', name: 'The Great Divide', accent: '#5a7d8c', dividers: { 18: 'The Last of the Bugs · Deluxe' }, tracks: [
    'End of August', 'Doors', 'American Cars', 'Downfall', 'Paid Time Off', 'The Great Divide', 'Haircut', 'Willing and Able', 'Dashboard', '23', 'Porch Light', 'Deny Deny Deny', 'Headed North', 'We Go Way Back', 'Spoiled', 'All Them Horses', 'Dan',
    'Lighthouse', 'Staying Still', 'A Few of Your Own', 'Orbiter'] },
];

const GRACIE_ALBUMS = [
  { id: 'minor', name: 'Minor (EP)', accent: '#9aa7c4', tracks: [
    'Friend', '21', 'Under/Over', 'Tehe', 'I Miss You, I’m Sorry', 'Long Sleeves', 'Minor'] },
  { id: 'tiwifl', name: 'This Is What It Feels Like (EP)', accent: '#c98aa4', tracks: [
    'Feels Like', 'Rockland', 'For Real This Time', 'Camden', 'The Bottom', 'Wishful Thinking', 'Older', 'Better', 'Hard to Sleep', 'Augusta', 'Painkillers', 'Alright'] },
  { id: 'goodriddance', name: 'Good Riddance', accent: '#6b6f86', dividers: { 13: 'Deluxe' }, tracks: [
    'Best', 'I Know It Won’t Work', 'Full Machine', 'Where Do We Go Now?', 'I Should Hate You', 'Will You Cry?', 'Amelie', 'Difficult', 'This Is What the Drugs Are For', 'Fault Line', 'The Blue', 'Right Now',
    'Block Me Out', 'Unsteady', '405', 'Two People'] },
  { id: 'secretofus', name: 'The Secret of Us', accent: '#b07a9e', dividers: { 14: 'Deluxe' }, tracks: [
    'Felt Good About You', 'Risk', 'Blowing Smoke', 'I Love You, I’m Sorry', 'us. (feat. Taylor Swift)', 'Let It Happen', 'Tough Love', 'I Knew It, I Know You', 'Gave You I Gave You I', 'Normal Thing', 'Good Luck Charlie', 'Free Now', 'Close to You',
    'Cool', 'That’s So True', 'I Told You Things', 'Packing It Up'] },
  { id: 'daughterfromhell', name: 'Daughter from Hell', accent: '#a83a4a', dividers: { 17: 'Bonus Tracks' }, tracks: [
    'Hit the Wall', 'Death Wish', 'The Knife', 'Daughter from Hell', 'Look at My Life', 'Good Reason', 'Men Like You', 'Sober', 'Broke My Heart', 'Mews', 'Minibar', 'Imaginary Friend', 'Afflictions', 'Humming', 'What If It’s Right?', 'Cold Goodbyes',
    'Crazy Girl', 'Love Letter', 'Out of Nowhere'] },
];

const CHELSEA_ALBUMS = [
  { id: 'howtobehuman', name: 'How to Be Human', accent: '#4a90a4', dividers: { 14: 'Bonus Tracks' }, tracks: [
    'Sad Tonight', 'Strangers Again', 'What Would It Take', 'I Was in Heaven', 'Are You Listening', 'NJ', 'Somebody Else Will Get Your Eyes', 'You Are Losing Me', 'I Miss You', 'The Human Condition', 'Lucky', 'I Should Let You Go', 'How to Be Human',
    'New Recording 28 - Lions', 'Crazier Things'] },
  { id: 'whenicloseeyes', name: 'When I Close My Eyes', accent: '#5a5b8c', tracks: [
    'Forever', 'Calling All Angels', 'Easy', 'Devil On My Shoulder', 'When I Close My Eyes', 'Walking Away', 'Without You', 'Someone Else’s Heaven', 'Under', 'Red Flags', 'You Can Have It', 'If I Hadn’t Met You', 'You’re Gonna Miss This'] },
  { id: 'stellaria', name: 'Stellaria', accent: '#7e6a9e', tracks: [
    'Something More', 'Growing Up Is Hard', 'I Don’t Feel Alive', 'Men on the Moon', 'Your Bones', 'Hunting Season', 'If Not Yours', 'You’re All I Ever Dreamed Of', 'Loved By You', 'You Don’t Think About Me At All', 'Hold Me While It’s Ending', 'The Way You Love Me', 'No One Hates Me More', 'Hotel June', 'Stay Anything'] },
];

const RKS_ALBUMS = [
  { id: 'rks', name: 'RKS', accent: '#5f8f9e', tracks: [
    'Run', 'Counting Cards', 'Wasted', 'Cold Love', 'Lady Lie', 'American Shoes', 'Cocaine Jesus', 'Bare Bones', 'Goodnight Chicago', 'All’s Well That Ends', 'The Comedown'] },
  { id: 'htflf', name: 'How To: Friend, Love, Freefall', accent: '#c9603a', tracks: [
    'Pacific Love', 'Mission to Mars', 'Fever Pitch', 'It’s Called: Freefall', 'Holy War', 'Matchbox', 'Moody Orange', 'Hide', 'When It Lands', 'Painkillers', 'Recktify', 'Possum Queen', 'Polite Company'] },
  { id: 'lovehatemusicbox', name: 'Love Hate Music Box', accent: '#9e5fa8', tracks: [
    'Peter Pan', 'Sickset', 'Finalist', 'LOL', 'Lucky', 'Meticulous', 'Hot Pink Ice Cube', 'SVO', 'Code Blue', 'Overtime (feat. Kacey Musgraves)', 'Ghoul', 'John Woo', 'Low As We Go', 'Bearwalk', 'Superstar', 'Cinderella', 'Best Man', 'Rabbit Run', 'Daddy Yankee', 'Re-entry', 'No Occasion', 'Thanks for Coming'] },
];

const KELSEA_ALBUMS = [
  { id: 'thefirsttime', name: 'The First Time', accent: '#e0b34f', dividers: { 13: 'Bonus' }, tracks: [
    'XO', 'Peter Pan', 'Love Me Like You Mean It', 'Square Pegs', 'The First Time', 'Looking at Stars', 'Sirens', 'Secondhand Smoke', 'Dibs', 'Stilettos', 'Yeah Boy', 'Underage',
    'Out of the Blues', 'Boy Meets Girl'] },
  { id: 'unapologetically', name: 'Unapologetically', accent: '#b5417f', dividers: { 13: 'Deluxe' }, tracks: [
    'Graveyard', 'Miss Me More', 'Get Over Yourself', 'Roses', 'Machine Heart', 'In Between', 'High School', 'End of the World', 'I Hate Love Songs', 'Unapologetically', 'Music', 'Legends',
    'Fun and Games', 'I Think I Fell in Love Today', 'Landslide', 'This Feeling'] },
  { id: 'kelseaalbum', name: 'Kelsea', accent: '#4a90a4', tracks: [
    'Overshare', 'Club', 'Homecoming Queen?', 'The Other Girl', 'Love Me Like a Girl', 'Love and Hate', 'Bragger', 'Hole in the Bottle', 'Half of My Hometown', 'The Way I Used To', 'Needy', 'A Country Song', 'LA'] },
  { id: 'subjecttochange', name: 'Subject to Change', accent: '#7a9e5f', tracks: [
    'Subject to Change', 'The Little Things', 'I Can’t Help Myself', 'If You Go Down (I’m Goin’ Down Too)', 'Love Is a Cowboy', 'Muscle Memory', 'I Guess They Call It Fallin’', 'Weather', 'Universe', 'Walk in the Park', 'Heartfirst', 'You’re Drunk, Go Home', 'Doin’ My Best', 'Marilyn', 'What I Have'] },
  { id: 'patterns', name: 'Patterns', accent: '#d4607e', dividers: { 16: 'Deluxe' }, tracks: [
    'Patterns', 'Sorry Mom', 'Baggage', 'First Rodeo', 'Nothing Really Matters', 'How Much Do You Love Me', 'Two Things', 'We Broke Up', 'Wait!', 'Beg for Your Love', 'Deep', 'Cowboys Cry Too', 'I Would, Would You', 'This Time Last Year', 'Did You Make It Home?',
    'To the Men That Love Women After Heartbreak', 'Future Tripping', 'Put It to Bed', 'Cut Me Up', 'Hindsight Is Happiness'] },
];

const GIRLINRED_ALBUMS = [
  { id: 'ificouldmakeitgoquiet', name: 'If I Could Make It Go Quiet', accent: '#c23b3b', tracks: [
    'Serotonin', 'Did You Come?', 'Body and Mind', 'Hornylovesickmess', 'Midnight Love', 'You Stupid Bitch', 'Rue', 'Apartment 402', '.', 'I’ll Call You Mine', 'It Would Feel Like This'] },
  { id: 'imdoingitagainbaby', name: 'I’m Doing It Again Baby!', accent: '#d98f3f', tracks: [
    'I’m Back', 'Doing It Again Baby', 'Too Much', 'Phantom Pain', 'You Need Me Now?', 'A Night to Remember', 'Pick Me', 'Ugly Side', 'New Love', '★★★★★'] },
];

const TYLER_ALBUMS = [
  { id: 'purgatory', name: 'Purgatory', accent: '#8a6d3b', tracks: [
    'I Swear (To God)', 'Feathered Indians', 'Tattoos', 'Born Again', 'Whitehouse Road', 'Banded Clovis', 'Purgatory', 'Honky Tonk Flame', 'Universal Sound', 'Lady May'] },
  { id: 'countrysquire', name: 'Country Squire', accent: '#6b8e5a', tracks: [
    'Country Squire', 'Bus Route', 'Creeker', 'Gemini', 'House Fire', 'Ever Lovin’ Hand', 'Peace of Mind', 'All Your’n', 'Matthew'] },
  { id: 'longviolenthistory', name: 'Long Violent History', accent: '#7a6a3f', tracks: [
    'Send In the Clowns', 'Zollie’s Retreat', 'Squirrel Hunter', 'Sludge River Stomp', 'Midnight on the Water', 'Camp Chase', 'Jenny Lynn', 'Bonaparte’s Retreat', 'Long Violent History'] },
  { id: 'hounds', name: 'Can I Take My Hounds to Heaven?', accent: '#a5552d', tracks: [
    'The Old Country Church', 'Can I Take My Hounds to Heaven?', 'Two Coats', 'Purgatory', 'The Way of the Triune God', 'Angel Band', 'Jubilee', 'Heart You’ve Been Tendin’'] },
  { id: 'rustininthrain', name: 'Rustin’ in the Rain', accent: '#5a7d8c', tracks: [
    'Rustin’ in the Rain', 'Phone Calls and Emails', 'Luke 2:8–10', 'Help Me Make It Through the Night', 'Percheron Mules', 'In Your Love', 'Space and Time'] },
  { id: 'snipehunter', name: 'Snipe Hunter', accent: '#9e6b3a', tracks: [
    'Eatin’ Big Time', 'Cuttin’ Teeth', 'Oneida', 'Getting to the Bottom', 'Bitin’ List', 'Nose on the Grindstone', 'Watch Out', 'Down Under', 'Poachers', 'Snipe Hunt', 'Tirtha Yatra', 'Tomcat and a Dandy', 'Dirty Ought Trill'] },
];

export const ARTISTS = [
  { id: 'taylor', name: 'Taylor Swift', accent: '#a23a63', blurb: 'Pop to folklore', albums: TAYLOR_ALBUMS },
  { id: 'noah', name: 'Noah Kahan', accent: '#3f6b4f', blurb: 'Folk-pop, Vermont', albums: NOAH_ALBUMS },
  { id: 'gracie', name: 'Gracie Abrams', accent: '#8a7fb0', blurb: 'Bedroom confessional', albums: GRACIE_ALBUMS },
  { id: 'chelsea', name: 'Chelsea Cutler', accent: '#3f7ba0', blurb: 'Indie-pop', albums: CHELSEA_ALBUMS },
  { id: 'rks', name: 'Rainbow Kitten Surprise', accent: '#9e5fa8', blurb: 'Indie rock', albums: RKS_ALBUMS },
  { id: 'kelsea', name: 'Kelsea Ballerini', accent: '#d98f3f', blurb: 'Country pop', albums: KELSEA_ALBUMS },
  { id: 'girlinred', name: 'girl in red', accent: '#c23b3b', blurb: 'Bedroom pop', albums: GIRLINRED_ALBUMS },
  { id: 'tyler', name: 'Tyler Childers', accent: '#8a6d3b', blurb: 'Appalachian country', albums: TYLER_ALBUMS },
];
