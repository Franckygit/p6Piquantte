// Création des actions pour le modèle "sauce"
const Sauce = require("../models/sauces");
const fs = require("fs");

// Ajout d'une sauce dans la BDD
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Récupération des informations
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ // Récupère la sauce ayant pour ID celui qui a été sélectionné par l'utilisateur
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Modif des informations d'une seule sauce
exports.modifySauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          };
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
            .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    const sauceObject = { ...req.body };
    Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

// Suppression d'une seule sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      })
    })
    .catch((error) => res.status(500).json({ error }));
};

// Afficher toutes les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find() // Créer un tableau de toutes les Sauces (models) dans la base de données
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Ajout des likes et dislikes pour chaque sauce
exports.likeSauce = (req, res) => {
  // Si le client Like cette sauce
  if (req.body.like === 1) {
    Sauce.findOne({ _id: req.params.id }).then((resultat) => { //recherche dans l'array des utilisateurs qui ont like
      if (resultat.usersLiked.includes(req.body.userId)) { //si l'utilisateur s'y trouve, on ne fait rien, puisqu'il a déjà like
        throw 'null';
      } else {
    Sauce.findOneAndUpdate( // sinon on comptabilise le like et on update le compteur
      { _id: req.params.id },
      { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } } // on incrémente et on push le user id dans l'array des utilisteurs qui ont like, pour empêcher la réitération
    )
      .then(() => res.status(200).json({ message: "Like ajouté !" }))
      .catch((error) => res.status(400).json({ error }))
  }})
    /* Si le client dislike cette sauce */
  } else if (req.body.like === -1) {
    Sauce.findOne({ _id: req.params.id }).then((resultat) => { //recherche dans l'array des utilisateurs qui ont dislike
      if (resultat.usersLiked.includes(req.body.userId)) { //si l'utilisateur s'y trouve, on ne fait rien, puisqu'il a déjà dislike
        throw 'null';
      } else {
    Sauce.findOneAndUpdate( // sinon on comptabilise le dislike et on update le compteur
      { _id: req.params.id },
      { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } } // on incrémente et on push le user id dans l'array des utilisteurs qui ont like, pour empêcher la réitération
    )
      .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }))
    }})
    /* Si le client annule son choix */
  } else {
    Sauce.findOne({ _id: req.params.id }).then((resultat) => { // recherche dans l'array des utilisateurs qui ont like/dislike
      if (resultat.usersLiked.includes(req.body.userId)) { // s'il s'y trouve (oui), alors on décrémente et on update le compteur que ce soit un like ou un dislike
        Sauce.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
        )
          .then(() => res.status(200).json({ message: "Like retiré !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (resultat.usersDisliked.includes(req.body.userId)) {
        Sauce.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
        )
          .then(() => res.status(200).json({ message: "Dislike retiré !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    });
  }
};