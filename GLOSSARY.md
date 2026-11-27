# X Search

A Raycast extension that writes an X search query and opens the results on x.com.

## Search

**Advanced search**:
The form in this extension. Its fields are words, language, accounts, replies, links, engagement, and dates. The date fields are labeled From and To. The account fields are labeled From these accounts, To these accounts, and Mentioning these accounts.
_Avoid_: advanced query builder, search builder, filter screen

**Draft**:
The field values Raycast keeps when you close Advanced Search without searching. A search drops it.
_Avoid_: saved form, autosave, cache

**Quick search**:
The command where you type your own search query, as in X's search box, and open it on x.com.
_Avoid_: simple search, basic search, raw search

**Search query**:
The text X's search box would contain. Advanced Search writes it. Quick Search uses it as typed.
_Avoid_: search string, filter string, q

**Query part**:
The piece of the search query that one field writes, such as `from:X` or `min_faves:280`. Empty parts are left out.
_Avoid_: clause, segment, token, chunk

**Search link**:
The x.com address that opens a search query.
_Avoid_: search URL, deep link, results link

**Results tab**:
Top, Latest, People, Media, or Lists on X's search results page. People is X's name for the tab of accounts; elsewhere, say account.
_Avoid_: feed, timeline, sort, filter, search filter

**Preferred tab**:
The results tab set in the extension preferences, Top or Latest. A search opens it unless you choose another results tab.
_Avoid_: default tab, saved tab, results preference

**Preferred browser**:
The web browser set in the extension preferences. A search opens in it. With none set, the system browser opens the search link.
_Avoid_: default browser, browser preference

**Extension user**:
A person who uses X Search in Raycast.
_Avoid_: user, customer

**Post**:
A message published on X.
_Avoid_: tweet

**Original post**:
A post that is not a reply.
_Avoid_: tweet, root post

**Reply**:
A post sent in reply to an account.
_Avoid_: comment, response

**Account**:
A person or organization on X that can send, receive, or be mentioned in a post.
_Avoid_: user, profile, handle

**Like**:
A mark of approval on a post.
_Avoid_: favorite, fave

**Repost**:
A post shared again by another account.
_Avoid_: retweet

## Filters

**Filter**:
A part of the search query that keeps or leaves out posts of a kind, such as replies or posts with links.
_Avoid_: tab, refinement

**Include**:
Replies, or posts with links, stay in the results together with the other posts.
_Avoid_: all, both, on

**Only**:
The results contain replies, or only posts with links.
_Avoid_: exclusive, just

**Exclude**:
Replies, or posts with links, are left out of the results.
_Avoid_: off, hide, without

## Repositories

**Development repository**:
This repository, where X Search is developed and tested.
_Avoid_: dev repo, main repo, source repo

**Store repository**:
Raycast's repository of Store extensions. The Store ships X Search from its `extensions/x-search` folder.
_Avoid_: submission repo, Raycast repo, upstream

**Repository sync**:
Bringing the development repository and the Store repository to the same extension, in either direction. A pull brings Store repository changes into the development repository, and a publish sends development repository changes to the Store repository.
_Avoid_: sync, mirror, merge back
