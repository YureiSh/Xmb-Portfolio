1. Pixel perfect the item tracks.
-  In Xmb.jsx changed behaviour of the xmb__item and xmb__item--active. This way unactive xmb__item's will look closer to each other just like XMB platform style.

- In Xmb.jsx and .css, changed active item behaviours and its scales to make it similar. Now only 
the images scale while text don't change. 


2. sfx (Week 4)
- ``if (isNavigationLocked(state)) return;`` is added, to block collision on Gsap timeline. bootPhase state from redux is now available.
- We enabled press start screen, but not completely. Check xmbslice and xmb .jsx files. The "PRESS START" should change...
- BootSequence is completed, closer to XMB 3.0+ version. In PressStartGate we have, a dispatch in line 28 setting the bootPhase to "boot-sequence" it enables the navigation input.

- (03.09.26 15.48) Now, we added a sample sound. It is added as playNavigate, uses osc and a gain. Osc is basic freq sound, gain is amplifier and 
destination is the speaker. We gave sample frequency and its wave shape for 60ms that will act as our navigation sound. We will work on it
through our ears or through any example in internet. I think i understand why my old simple html+js case study rejected, i was using mp3 file for
"boop" sound effect.

- (03.09.26 16.25) Okay we maintain cool sound effects for navigation and select, but it is not the same or similar to the playstation's sfx. It doesn't feel the same or sounds the same. It is also really hard to beat such a customized sound effect with only 1 osc.

3. gamepad api

4. webgames

5. Q E click link for project pages completed