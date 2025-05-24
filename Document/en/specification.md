# PintHop Update Specification

## 1. Concept Redefinition: Comprehensive Enhancement of Beer Experience

PintHop is being redefined as a comprehensive craft beer platform that equally emphasizes the experience of "finding yourself drinking with friends without realizing it" and the function of "finding your next pint." We aim to improve the quality of both enjoying beer alone and drinking with friends.

### 1.1 Two Core Experiences
- **Finding the next pint (personal experience)**:
  - Priority on discovering highly-rated beers
  - Clear display of breweries' specialty styles and award history
  - Centralized display of ratings from multiple review sites
  - Achievement metrics such as regional brewery visitation rates
- **Connecting naturally (social experience)**:
  - Zero psychological barrier design
  - Real-time presence sharing
  - Creating encounters that appear coincidental
  - Flexible privacy controls

### 1.1 Brewery Database Expansion
- **Detailed Information Management**:
  - Specialty beer styles (calculated from Untappd posts and awards)
  - Award history (regional, national, and international competition information)
  - Review site ratings (scores from Untappd, RateBeer, The Beer Connoisseur, RateBeer)
  - BJCP-compliant beer style classification and brewery-specific style classifications
- **Data Update System**:
  - Monthly regular updates
  - JSON-based management (considering regional expansion)
  - Community contribution-based editing system
  - Future AI-based automatic update system

### 1.2 Tap List Sharing System
- **User Posting Function**:
  - Design that allows anyone to post
  - Simplified photo uploads (one-tap operation)
  - Automatic recording of photo date and time
  - Post date and time display for freshness confirmation
- **Future Implementation**:
  - AI-OCR automatic tap list recognition
  - Text data conversion and database registration

### 1.3 Beer Experience Recording
- **Simple Posting Function**:
  - Posting possible with minimal information (beer name only, photo only)
  - Optional addition of detailed information
  - Linked recording of brewery visits and beer consumption
- **Check-in Methods**:
  - One-tap from the map
  - Automatic recommendations from location information
  - Display friends' beer information on timeline and map

### 1.4 Search and Filtering Functions
- **Brewery Search Functions**:
  - Regional search
  - Brewery name search
  - Sorting by review site scores
  - Search for award-winning beers
- **Future Implementation**:
  - Search based on specific user preferences
  - AI recommendation features

### 1.5 User Interface
- **5-Tab Structure**:
  - Timeline (friends' activities)
  - Map (location information)
  - Brewery search
  - Events
  - User profile
- **Brewery Details Page**:
  - Tap list (latest posts)
  - Specialty beer styles and highlights
  - Award history (visually easy to understand)
  - Ratings from each review site (numerical and graphical display)
  - Information about friends currently there

### 1.6 Badge and History System
- **Badge System**:
  - Style master badges (for drinking many)
  - Qualification holder badges (Beer Judge, Beer Certification, etc.)
  - Regional achievement badges (e.g., "Visited 50% of Seattle Breweries")
  - Seasonal badges (participating in seasonal events, etc.)
- **Beer History Function**:
  - Chronological display of drinking history
  - Statistical analysis (style trends, visitation patterns, etc.)
  - Regional visit achievement rate visualization

## 2. AI Automation Plan

### 2.1 Beer Information Registration Support
- **Impression Input Support**:
  - Complete information by matching user's simple input with the database
  - Suggesting necessary information input for beers consumed
  - Accurate beer/style identification from ambiguous expressions

### 2.2 Automatic Content Processing
- **Tap List OCR**:
  - Automatic text extraction from uploaded photos
  - Database conversion of beer lists
  - Automatic recognition of update date and time and freshness display

### 2.3 Automatic Database Updates
- **Brewery Information Collection**:
  - Automatic acquisition of evaluation scores from each review site
  - Regular automatic updates of award information
  - Collection of new and seasonal product information
- **Automatic JSON Generation/Updates**:
  - Automatic generation of JSON items when registering new breweries
  - Integration with information update program
  - Automatic data consistency checks

### 2.4 Personalized Recommendations
- **User Preference Analysis**:
  - Extracting preference patterns from consumption history
  - Recommendations based on similar users' behavior
  - Suggestions considering context (weather, time of day, location)
- **"Next Pint" AI Suggestions**:
  - Recommended beer suggestions around current location
  - Help discovering unexperienced beer styles that match preferences
  - Common recommendations considering friends' preferences

### 2.5 User Experience Enhancement
- **Natural Language Search**:
  - Natural language query support such as "places to drink bitter IPAs"
  - Complex condition combination searches (e.g., "award-winning stouts in X region")
- **Conversational Interface**:
  - AI assistant for beer selection
  - Providing beer knowledge in Q&A format
  - Beer style guidance for beginners

## 3. Revised User Interface Design

### 3.1 UI Basic Structure
- **Tab Navigation**:
  - Timeline: Chronological display of activities and posts from followed users (initial display tab)
  - Map: Display of location information for friends and breweries of interest
  - Brewery Search: Brewery search and discovery functions with various conditions
  - Events: Regional beer events, events hosted by followed users/breweries
  - Profile: User information, badges, beer history, regional visit achievement rate, etc.

### 3.2 Brewery Details Screen
- **Information Section**:
  - Basic information (name, address, business hours, contact information)
  - Visual display of specialty beer styles (high importance)
  - Graphical display of major review site ratings (high importance)
  - Highlight display of award history
- **Social Section**:
  - Display of friends sharing their current location
  - Check-in numbers and trends
  - Friends' visit history/plans
- **Beer Section**:
  - Latest tap list (posted photos)
  - User reviews
  - Recommended beers

### 3.3 Simplified Posting Flow
- **Check-in Flow**:
  1. Automatic display of brewery candidates from location information
  2. Check-in completed with one tap
  3. Optional addition of beer/photos (optional)
- **Beer Posting Flow**:
  1. Simple input of beer name/photo
  2. AI-assisted information completion (style, ABV, etc.)
  3. Optional addition of detailed impressions

### 3.4 Coexistence of Solo/Friends Modes
- **Common Values Across Modes**:
  - Priority on discovering highly-rated beers in both modes
  - All functions designed to be sufficiently useful for solo users
- **Natural Transition**:
  - Natural pathways from solo mode to joining friends
  - Optimization of information display according to privacy settings

## 4. Revised Data Model

### 4.1 Additional Core Entities
- **Beer**:
  - Basic information (name, style, brewery)
  - Detailed information (ABV, IBU, etc.)
  - Review site ratings
  - Award history
- **Tap List**:
  - Brewery ID
  - Beer list
  - Update timestamp
  - Posting user
- **Beer Experience**:
  - User ID
  - Beer ID
  - Consumption timestamp
  - Rating/comments (optional)
  - Related photos (optional)

### 4.2 Extended Data Relationships
- **User Extensions**:
  - Acquired badges
  - Beer experience history
  - Preference data
- **Brewery Extensions**:
  - Specialty styles (calculated/registered values)
  - Review site ratings
  - Tap list history
  - Event information

## 5. Revised Technology Stack

### 5.1 Brewery Data Management System
- **JSON-based Data Structure**:
  - Regional JSON files
  - Brewery basic information
  - Beer and style information
  - Review site ratings
- **Data Update System**:
  - Local editing of JSON files
  - Uploader interface
  - Community editing functions
  - Automatic update program (separate development)

### 5.2 AI Integration Technology
- **Natural Language Processing**:
  - Extraction and classification of beer information
  - Sentiment analysis of user reviews
- **Computer Vision**:
  - Tap list image OCR
  - Beer label recognition
- **Machine Learning**:
  - User preference models
  - Beer recommendation engine

## 6. Revised Roadmap

### Phase 0 (Micro MVP): 1-2 months
- Minimal implementation of real-time presence sharing
- Seattle-limited brewery map (JSON-based management)
- Basic functions for connecting with friends
- Minimal implementation of stay time sharing
- **Initial Brewery Database Construction**:
  - Basic information + major review site ratings
  - Basic implementation of specialty style information (foundation for discovering highly-rated beers)

### Phase 1 (Core MVP): 2-3 months
- Enhancement of presence functions
- Basic functions for sharing plans
- Ambient notification system
- Detailed privacy settings
- **Basic Beer Recording Functions**:
  - Simple check-ins
  - Basic beer posting functions
  - Drunk beer history
- **Addition of Event Information Tab**:
  - Basic display of regional beer events
  - Display of events hosted by followed users/breweries

### Phase 2 (Social Extension): 3-4 months
- Group presence function
- Enhanced context sharing
- Movement pattern analysis and prediction
- Strengthened real/digital integration
- **Beer Search and Discovery Functions**:
  - Style-based search
  - Sorting by review ratings (high importance)
  - Display of beers drunk by friends
- **Regional Achievement Rate Display**:
  - Visualization of regional brewery visit achievement rate
  - Display of regional style experience rate

### Phase 3 (Experience Extension): 4-6 months
- Beer hopping support functions
- Addition of minimal posting functions
- Enhanced event integration functions
- Evolution of psychological resolution
- **Badge System Introduction**:
  - Style experience badges
  - Brewery visit badges
  - Regional achievement badges
  - Qualification certification badges
- **Enhanced Tap List Sharing**:
  - Optimization of image uploads
  - Chronological management functions

### Phase 4 (Regional Expansion): 6-12 months
- Multi-city deployment foundation
- JSON-based expandable brewery data management system
- Traveler mode implementation
- International community building
- Realization of natural connections between regions
- **Initial AI Function Implementation**:
  - Tap list OCR trial introduction
  - Beer recommendation system foundation construction
  - Initial implementation of automatic database updates

### Phase 5 (AI Assistant): 12-18 months
- **Full-scale Introduction of AI Input Support**:
  - Natural language beer search
  - Impression input assistant
  - Automatic database updates
- **Personalized Recommendation Engine**:
  - Recommendations based on individual preferences
  - Analysis of common preferences for friend groups
  - Context-aware suggestions

## 7. Integration of Finding the Next Pint Experience and Presence Sharing

### 7.1 Creating Synergy
- **Integration of Real-time Information**:
  - Natural integration of "where friends are" and "recommended beers"
  - Association of current tap list status with friends' positions
  - Visualization of "beers this group of friends is enjoying"

### 7.2 Natural Discovery and Convergence
- **Enhanced Staging of Coincidences**:
  - Matching "people looking for this beer" with "people at places with that beer"
  - Natural connection of friends with common preferences
  - Presenting information like "this beer highly rated by your friend is available nearby"

### 7.3 Deepening the Experience
- **Improving Shared Experience Quality**:
  - From simple "meeting up" to "enjoying good beer together" experiences
  - Discovery and sharing of preferences with friends
  - Creating group exploration and discovery experiences

---

This specification aims to integrate PintHop's existing concept of "natural meet-up experience" with new functionality for "finding the next pint," with the goal of improving the overall craft beer experience. Through phased implementation, we will start with basic friend meet-up functions and eventually evolve into an AI-driven advanced beer recommendation and experience sharing platform.
