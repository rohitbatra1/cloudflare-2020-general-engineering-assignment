const links = [
  { "name": "Personal Project: ImageFinder for Safari - Easily Reverse Image Search in Safari", "url": "https://github.com/rohitbatra1/Safari-Reverse-Image-Search" },
  { "name": "GitHub", "url": "https://github.com/rohitbatra1" },
  { "name": "Portfolio Website", "url": "https://rohitbatra.me" }
]

const socials = [
  { "name": "LinkedIn", "url": "https://www.linkedin.com/in/rbatra2019/", "icon": "<svg role='img' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24' width='4vmax' height='4vmax'><title>LinkedIn</title><path class='LinkedIn' d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>"},
  { "name": "Email", "url": "mailto:rb4jx@virginia.edu", "icon": "<svg role='img' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24' width='4vmax' height='4vmax'><title>Email</title><path class='Email' d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/></svg>"}

]

// listener and handler for fetch event
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

class linksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
    for (let index = 0; index < this.links.length; index++){

      // format the link (<a href="https://asampleurl.com">A sample URL</a>)
      let curLink = "<a href=" + this.links[index]["url"] + " target=\"_blank\"" + ">" + this.links[index]["name"] + "</a>";
      
      element.append(curLink, { html: true });
    }
  }
}

class titleTransformer{
  constructor(title) {
    this.title = title
    }
  async element(element) {
    // replace the contents of title with the my title
    element.setInnerContent(this.title)
  }
}

class showProfileTransformer {
  async element(element) {
    // set the profile attribute to be shown
    element.setAttribute("style", "")
  }
}

class avatarTransformer{
  constructor(avatarElement, avatarImage) {
    this.avatarElement = avatarElement
    this.avatarImage = avatarImage
    }
  async element(element) {
    // set the avatar image
    element.setAttribute(this.avatarElement, this.avatarImage)
    element.setAttribute("style", "")
  }
}

class backgroundTransformer{
  constructor(object, color){
    this.object = object
    this.color = color
  }
  async element(element) {
    element.setAttribute(this.object, this.color)
  }
}

class nameTransformer {
  async element(element) {
    element.setInnerContent("Rohit")
  }
}

class socialTransformer{
  constructor(socialLinks){
    this.socialLinks = socialLinks
  }

  async element(element) {

    element.setAttribute("style", "")
    for (let index = 0; index < this.socialLinks.length; index++){

      // format the link (<a href="https://asampleurl.com"> <svg> icon.svg <svg> </a>)
      let curLink = "<a href=" + this.socialLinks[index]["url"] + " target=\"_blank\"" + ">" + this.socialLinks[index]["icon"] + "</a>";

      element.append(curLink, { html: true });
    }
  }

}


// return links array correctly formatted as JSON with proper header
 async function formatLinks(){
   const linksJSON = JSON.stringify(links)

   return new Response(linksJSON,{
    headers: {'content-type':'application/json'}
  })
 }

async function handleRequest(request) {

  // handle the /links request by returning the links as a JSON
  if (request.url.endsWith("/links")){
    linksJSON = formatLinks()

    return linksJSON
  }
  else{
    // render the page for any other requests

    const staticHTMLlink = "https://static-links-page.signalnerve.workers.dev"
    const contentHeader = { headers: { "content-type": "text/html", } }
    
    // fetch the page
    const response = await fetch(staticHTMLlink, contentHeader)

    // transform the the html page to look as desired
    const pageRewriter = new HTMLRewriter()
      .on("div#links", new linksTransformer(links, "name", "url"))
      .on("title", new titleTransformer("Rohit Batra"))
      .on("div#profile", new showProfileTransformer())
      .on("img#avatar", new avatarTransformer("src","http://github.com/rohitbatra1.png"))
      .on("body", new backgroundTransformer("class", "bg-blue-400"))
      .on("h1#name", new nameTransformer())
      .on("div#social", new socialTransformer(socials))

    // return the transformed page
    return pageRewriter.transform(response)

  }
  
}
