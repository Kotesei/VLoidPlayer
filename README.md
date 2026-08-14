# VLoid Player

<h3> This project is heavily inspired by an animation created by </h3>

<a href="https://www.youtube.com/@channelcaststation">![Static Badge](https://img.shields.io/badge/channel-red?style=for-the-badge&logo=youtube)
</a>

# How did we get here?

<br>

<p>So I was just enjoying some good ol' music from the many creative artists on YouTube, specifically with the Teto voicebank..</p>
<p>A couple of days later I would stumble upon different videos and of course out of curiosity I watched them. Usually I stick around if the song speaks to me.</p>
<p>The more I watched, the more the algorithm would update and show me more. That is when I found this cool lil animation from this channel called.. that's right.. you guessed it.. "channel".</p>

<br>
<h1 align=center>WAIT, THIS WOULD BE SO COOOL AS AN APP <br><br></h1>

### And so here we are.

<p>This is the start of the project, and the goal is to build a music player with those cool animations that inspired me to code this up.</p>

# Goals:

- [ ] [**95% Done**] Sample Website (Testing Phase.)

- [ ] [**60% Done**] Fully Built Electron App (Functionality done, needs file system management, advanced audio, song bpm detection for on beat animation)

- [ ] [**0% Done**] Mobile Version (Haven't started)

- [ ] [**25% Done**] At least two custom animations inspired from [channel](https://www.youtube.com/@channelcaststation) (Currently Finished drawing 1/2, no animations yet.)

# Things to consider for final build

- [x] Apply the remove from database function to the songs from the upload page as well (Should only apply to the blue color coded files)

- [ ] Create a route to the upload page and player

- [ ] Add an option to remove all from database and a confirmation popup.

- [ ] Fix next in queue and make sure it shows the right state for liked song or not

- [ ] Don't show a queue if there's only one song loaded regardless of loop state

- [ ] Ensure web app works well on mobile devices (Things such as the slider for seeking are bugged on mobile since it most likely uses a different event listener)

- [ ] Thinking of adding a cool visual animation for when importing songs, will most likely add it after most the app is functional (Need to ensure app runs decent at least on web before considering it but I'll apply it on the actual app)

- [x] ~~Option to disable cover art animations~~

- [x] ~~Need to consider the possibility of no metadata + different audio formats (Possible to add an actual audio file but since there is missing information, the app bugs out and won't show the animation properly)~~

- [x] ~~Store the music and metadata inside a local database. (Metadata can be stored, need to test storing music files as well in order to skip upload page).~~

- [x] ~~Music should be prerendered for web example, probably gonna have a loader before the app loads since this app is not intended for use with internet~~ Upload page shows up first, which allows either sample music to be selected from the list (Randomly Max 3) or take however much songs the user puts in.

- [x] ~~Make sure nothing but valid audio sources are added (It's currently possible to throw in files that aren't even audio)~~

- [x] ~~Do some tests in the network tab and make sure everything only needs to render once. Things like the animation or the cover art can render as much as needed since those are always changing. I noticed icons like svgs on click are rerendering and while it's very little impact in terms of size when rendering, I rather eliminate rerendering if it is not required.~~ (Most of the rendering seems to be low enough to have low impact and is mostly relying on Blobs)

- [ ] ~~Consider multiple artists involved as well~~ Not working on this, seems extra for web version (Saving it for actual app purposes instead)

- [ ] ~~(MAYBE) Switch to using a more advanced audio API for preventing weird cutoff when changing/looping audio. It should be seamless.~~ (Saving for actual app)
