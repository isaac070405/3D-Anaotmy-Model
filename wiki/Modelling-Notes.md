# Modelling Notes

- Organ sizes run about 60–80% of textbook measurements so neighbouring structures fit without overlap.
- Vessels that join major trunks (renal, testicular, gut arteries) belong to Circulatory so connections stay intact when systems are hidden.
- Translucent walls (kidney cortex, stomach, bladder, prostate, scrotum) expose internal structure; subsurface effects are approximated with sheen and clearcoat.
- Fine surface textures (gastric pits, filiform papillae, skin micro-rugae) are omitted because textures don't survive OBJ export.
- A small disclaimer under the page lede links to `known-limitations.html`, which lists the areas that are approximate, thin or missing.
- Reproductive system has male and female variants, switched with the Sex control; penis shown flaccid.
- The female body mesh (`uploads/Female_Muscular_BaseMesh`) is not in the repository. Without it the generic body surface stays on, minus the male genitalia, and the female structures still show.
- The menstrual cycle slider (day 1 to 28) changes endometrial thickness, the dominant follicle on the right ovary, the released oocyte on day 14 and the corpus luteum in the luteal phase.

---
[← Anatomy review additions](Anatomy-Review-Additions) · [Home](Home)

## Eye meshes

The eyeball (sclera, choroid, retina, vitreous body, cornea, iris and ciliary body, lens, suspensory ligament) uses meshes from feelpp/mesh.eye v1.1 (Zenodo 10.5281/zenodo.15630998, GPL-3.0-only; Chabannes, Prud'homme, Saigre, Sala, Szopos, Trophime). They load from `assets/eye.glb`, scaled to the sclera radius of the model, and the left eye is mirrored for the right. Solid names were matched from geometry (`scripts/eye_names.json`). The two retinal vessels in the source are not shown.
