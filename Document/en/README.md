# PintHop 🍻

## Find your next pint. Whether alone or with friends.

**PintHop** is an open-source app with two core functions to enhance your craft beer experience:

1. **Discover your next pint**: Easily find beers that match your preferences or are highly rated, enhancing the quality of your beer experiences
2. **Connect with the community**: Enable natural meet-ups with friends and share knowledge of the beer community

Whether you're enjoying beer alone or drinking with friends, PintHop enriches your beer experience. You can know where your friends are and what beers they're enjoying without prior planning or explicit invitations, allowing for natural meet-ups, or you can explore new beers on your own.

**[Want to contribute?](#contribute)**

## 🌟 Concept

PintHop is an app that fuses two core experiences:

- **Discover your next pint**:
  - Support encounters with quality beers
  - Visualization of breweries' specialty styles and award history
  - Centralized display of review site ratings
  - Community sharing of tap list information

- **Create natural connections**:
  - **Zero psychological barriers**: No social pressure of "inviting/being invited"
  - **Real-time presence**: Instantly know where your friends are
  - **Natural meet-ups**: Creating encounters that appear coincidental without planning
  - **Privacy-focused**: Complete control over how much of your information is shared

A design that enhances both the joy of exploring new beers alone and the fun of accidentally meeting friends and drinking together.

## 💫 Main Features

- **One-tap check-in**: Just tap when you arrive at a brewery. No detailed input required
- **Ambient presence display**: Subtly notify where your friends are
- **Stay time sharing**: Simple information display like "I'll be here for about another hour"
- **Plan visualization**: See today's/this week's brewery visit plans (optional sharing)
- **Group dynamics**: Natural visibility of friend group formation and movement
- **Real-time map**: See currently active spots and which friends are there
- **Tap list sharing**: Users upload the latest tap list photos
- **Brewery detailed information**: Display specialty styles, award history, and ratings from each review site
- **Beer recording**: Easily record beers consumed and review chronologically
- **Beer style search**: Search for beers by BJCP-compliant style classification

## 🚀 Differences from Conventional Apps

### 1. Integration of Beer Discovery and Community
- **Conventional Beer Apps**: Focus on recording and collection, social elements are secondary
- **PintHop**: Natural fusion of beer discovery experience and real-time connections
- **Integrated Value**: Creating synergy between "which beer to drink" and "who to drink with"

### 2. "Presence" Rather Than "Posting"
- **Conventional SNS**: Post and share places visited and things consumed afterward
- **PintHop**: Simple sharing of where you are now is the beginning of everything
- **Experience over Recording**: Photos and reviews are secondary, first improving the quality of the experience

### 3. Elimination of Psychological Hurdles
- **Conventional Apps**: Explicit flow of "invite → approve/decline"
- **PintHop**: Only information presentation of "I am here now," no obligation to respond
- **Natural Participation**: Possibility of ambiguous expressions of intent like "might go" or "interested"

### 4. Real-time Experience
- **Conventional SNS**: Recording of past activities and coordination of future plans
- **PintHop**: Presence focused on "this moment now"
- **Immediacy**: Know which places and friends are active the moment you open the app

### 5. Integration of Beer Information
- **Conventional Beer Apps**: Individual reviews and check-ins are dispersed
- **PintHop**: Centralized display of ratings from multiple review sites, specialty styles, and tap lists
- **Fulfilling Even Alone**: Enhancing the quality of solo drinking with unique beer recommendations and information aggregation

## 💻 Technology Stack

### Current Implementation (PWA)
- **Frontend**: React + TypeScript (Progressive Web App)
- **Real-time Foundation**: Firebase Realtime Database + Firestore
- **Maps**: Google Maps JavaScript API
- **Authentication**: Firebase Authentication
- **Hosting**: Firebase Hosting
- **Data Management**: JSON-based brewery data system (considering regional expansion)

### Future Extensions
- **Presence Optimization**: Real-time updates with reduced battery load
- **Context Awareness**: Adaptive behavior according to time of day and location
- **Offline Operation**: Design available regardless of connection status
- **AI Functions**: Tap list OCR, beer recommendations, natural language search

## 🗺️ Development Roadmap

### Phase 0: Minimal Presence MVP (1-2 months)
- Basic "I am here now" functionality
- Seattle-limited brewery map (JSON file-based)
- Basic functions for connecting with friends
- Simple stay time sharing
- Brewery basic information database

### Phase 1: Presence Enhancement (2-3 months)
- Rich presence state expression
- Simple plan sharing functionality
- Expansion of context information
- Ambient notification system
- Simple beer recording functionality

### Phase 2: Group Dynamics (3-4 months)
- Visualization of group presence
- Analysis and display of movement patterns
- Loose expression of intent like "might go next"
- Suggestion of natural convergence points
- Beer search and filtering functions

### Phase 3: Experience Extension (4-6 months)
- Badge system introduction
- Enhanced tap list sharing
- Natural connection with events
- Foundation for multi-city support
- Beginning of internationalization

### Phase 4: AI Assistance Functions (6-12 months)
- Tap list OCR
- Beer recommendation system
- Automatic database updates
- Natural language beer search

## <a name="contribute"></a>🛠️ Join the Community

We are building PintHop together! You can contribute in the following ways:

### For Developers
- **Frontend Development**: Design and implementation of real-time UI/UX components
- **Backend Optimization**: Efficient utilization and query optimization of Firebase RTDB
- **Location Information Processing**: Development of efficient, low-power location information systems
- **PWA Specialists**: Improvement of offline functions and push notifications
- **Data Management System**: Improvement of JSON-based brewery data update and verification systems
- **Automatic Data Collection**: Development of brewery information automatic collection tools
- **Getting Started**: Check out "beginner-friendly tasks" in [GitHub Issues](https://github.com/pinthop/pinthop)

### For Designers
- **UX Design**: Operation flow design with zero psychological barriers
- **Ambient UI**: Design of subtle yet effective information display
- **Map Visualization**: Design of intuitive expression methods for spatial information
- **State Expression**: Visual design to communicate diverse presence states
- **Beer Information UI**: Attractive ways to display beer data

### For Beer Enthusiasts
- **Local Testers**: Feedback on app usage experience at actual breweries
- **Regional Ambassadors**: Bridge to regional beer communities
- **Brewery Data Preparation**: Provision of regional brewery information in JSON format
- **Data Verification**: Confirmation of regional brewery information accuracy and feedback
- **Beer Culture**: Understanding and implementation proposals for region-specific beer culture
- **Tap List Sharing**: Posting tap list photos from visited breweries

### For Everyone
- **User Testing**: Trial and feedback of early versions
- **Concept Proposals**: New feature ideas for "natural meet-up experience" and "beer discovery"
- **Community Formation**: Establishment and operation of regional PintHop user groups
- **Spread the Word**: Introduction of the app to beer friends

## 🌐 How to Participate

1. **Star and Watch GitHub Repository**: Check out the GitHub repository and participate in development
2. **Contact the Developer**: Contact via DM on Twitter [@rihobeer2](https://twitter.com/rihobeer2) or Instagram [@lobeerve](https://instagram.com/lobeerve)
3. **Follow the Blog**: Check for latest information on the developer's blog [rihobeer.com](https://rihobeer.com)
4. **Communication Platform**: Currently in preparation. Details will be announced in the future

### Future Plans
- Guidelines for community contributions will be developed
- AI-enhanced development process will be introduced
- Contribution mechanisms through GitHub Issues and Pull Requests will be established

## 👥 Who is this App For?

- **Solo Beer Enthusiasts**: People who pursue high-quality beer experiences even alone
- **Craft Beer Explorers**: People who want to discover new beer styles and highly-rated beers
- **Social Drinkers**: Craft beer enthusiasts who want to meet friends without prior planning
- **People Who Feel Social Pressure**: People who want to reduce the burden of inviting or being invited
- **Regional Beer Communities**: Community builders such as members and organizers
- **Beer Travelers**: People who want to experience the local beer scene when visiting new cities
- **Beer Knowledge Collectors**: People who prioritize breweries' specialty styles and review ratings

For all who pursue the best beer experience, whether alone or with friends, in their own way of enjoyment.

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

**PintHop** - Natural encounters and your next pint with beer
