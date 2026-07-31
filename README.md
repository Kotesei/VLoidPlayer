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

- [ ] Sample Website
- [ ] Fully Built Electron App
- [ ] Mobile Version
- [ ] At least two custom animations inspired from [channel](https://www.youtube.com/@channelcaststation)

# Things to consider for final build

- Do some tests in the network tab and make sure everything only needs to render once. Things like the animation or the cover art can render as much as needed since those are always changing. I noticed icons like svgs on click are rerendering and while it's very little impact in terms of size when rendering, I rather eliminate rerendering if it is not required.

- Music should be prerendered for web example, probably gonna have a loader before the app loads since this app is not intended for use with internet (I might or might not look into server sided things but I really want this to be a standalone music player)
