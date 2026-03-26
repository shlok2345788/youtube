// Test video URLs from Google Cloud Storage sample bucket
const TEST_VIDEO_URLS = {
  BigBuckBunny:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  Sintel:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  TearsOfSteel:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  ElephantsDream:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  ForBiggerBlazes:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  ForBiggerEscapes:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
};

// 🟢 EXPORT the full array of video objects for use in other components.
const ALL_VIDEOS = [
  {
    _id: "1",
    videotitle: "Amazing Nature Documentary ",
    filename: "nature-doc.mp4",
    filepath: TEST_VIDEO_URLS.BigBuckBunny,
    videochanel: "Nature Channel",
    views: 45000,
    Like: 1250,
    Dislike: 50,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    smallvideo: TEST_VIDEO_URLS.BigBuckBunny,
    subscribers: "20K",
  },
  {
    _id: "2",
    videotitle: "Cooking Tutorial: Perfect Pasta",
    filename: "pasta-tutorial.mp4",
    filepath: TEST_VIDEO_URLS.Sintel,
    videochanel: "Chef's Kitchen",
    views: 23000,
    Like: 890,
    Dislike: 20,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    subscribers: "3M",
  },
  {
    _id: "3",
    videotitle: "RenGoku vs Mussa",
    filename: "fight.mp4",
    filepath: TEST_VIDEO_URLS.TearsOfSteel,
    videochanel: "golu_yeager",
    views: 25000,
    Like: 430,
    Dislike: 5,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    subscribers: "10K",
  },
  {
    _id: "4",
    videotitle: "SouthIndies vs India",
    filename: "cricket.mp4",
    filepath: TEST_VIDEO_URLS.ElephantsDream,
    videochanel: "Sport Highlights",
    views: 350000,
    Like: 15000,
    Dislike: 500,
    subscribers: "2K",
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
  },
  {
    _id: "5",
    videotitle: "TriggerInsan's Latest VLOG",
    filename: "vlog.mp4",
    filepath: TEST_VIDEO_URLS.ForBiggerBlazes,
    videochanel: "Trigger",
    views: 25000,
    Like: 900,
    Dislike: 15,
    subscribers: "60K",
    createdAt: new Date(Date.now() - 1209600000).toISOString(), // 2 weeks ago
  },
  {
    _id: "6",
    videotitle: "Musa's Best Dance Moves",
    filename: "dance.mp4",
    filepath: TEST_VIDEO_URLS.ForBiggerEscapes,
    videochanel: "golu_yeager",
    views: 10000,
    Like: 120,
    Dislike: 1,
    subscribers: "20M",
    createdAt: new Date(Date.now() - 2419200000).toISOString(), // 1 month ago
  },
];

export const user = [
  {
    id: "1",
    username: "Vedant Dighe",
    email: "vedantgighle202022@gmail.com",
  },
  {
    id: "2",
    username: "Rohit Sharma",
    email: "rohit.sharma23@example.com",
  },
  {
    id: "3",
    username: "Sneha Patil",
    email: "sneha.patil55@example.com",
  },
  {
    id: "4",
    username: "Aarav Mehta",
    email: "aarav.mehta92@example.com",
  },
  {
    id: "5",
    username: "Krisha Shah",
    email: "krisha.shah21@example.com",
  },
  {
    id: "6",
    username: "Aditya Deshmukh",
    email: "aditya.deshmukh88@example.com",
  },
  {
    id: "7",
    username: "Mahima Kulkarni",
    email: "mahima.kulkarni05@example.com",
  },
  {
    id: "8",
    username: "Yash Verma",
    email: "yash.verma40@example.com",
  },
  {
    id: "9",
    username: "Priya Nair",
    email: "priya.nair29@example.com",
  },
  {
    id: "10",
    username: "Karan Gupta",
    email: "karan.gupta74@example.com",
  },
];

export default {
  ALL_VIDEOS,
  user,
};
