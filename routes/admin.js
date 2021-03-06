const express = require('express');
const router = express.Router();

module.exports = ({ getOrderedDishes, getSalesByMonths, getDishes, getDish, deleteDish, updateDish, addNewDish }) => {
  router.get("/", (req, res) => {
    //if has cookie
    if (req.session.isAuthenticated) {
      res.render("admin-order-status", { page: 'admin' });
    } else {
      res.render("adminLogin");
    }

  });

  router.post("/", (req, res) => {
    // check inputed password
    if (req.body.password === "1234") {
      req.session.isAuthenticated = true;
      res.redirect("/admin");
    } else {
      res.render("adminlogin");
    }
  });

  router.get("/analytics", (req, res) => {
    if (req.session.isAuthenticated) {
      res.render("analytics", { page: 'analytics' });
    } else {
      res.redirect("/admin");

    }
  });

  router.get("/analytics/overall_sales", (req, res) => {
    if (req.session.isAuthenticated) {
      getOrderedDishes()
        .then(totalOrderedDishes => res.json(totalOrderedDishes))
        .catch(err => res.status(500).json({ error: err.message })
        );
    } else {
      res.status(401).json({ error: 'You do not have permission to access this.' });
    }

  });

  router.get("/analytics/sales_by_months", (req, res) => {
    if (req.session.isAuthenticated) {
      getSalesByMonths()
        .then(totalOrderedDishes => res.json(totalOrderedDishes))
        .catch(err => res.status(500).json({ error: err.message })
        );
    } else {
      res.status(401).json({ error: 'You do not have permission to access this.' });
    }

  });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect('/admin');
  });

  router.get("/display", (req, res) => {
    if (req.session.isAuthenticated) {
      getDishes()
        // .then(dishes => console.log(dishes[0].name))
        .then(dishes => {
          res.render("display", { dishes, page: 'display' });
        });
    } else {
      res.redirect("/admin");
    }
  });

  router.get("/display/:id/edit", (req, res) => {
    if (req.session.isAuthenticated) {
      const dishId = req.params.id;
      getDish(dishId)
        .then(dish => res.render("edit", { dish }));
    } else {
      res.redirect("/admin");
    }
  });

  router.post("/display/:id/edit", (req, res) => {
    if (req.session.isAuthenticated) {
      const dishId = req.params.id;
      const updatedDish = req.body.updatedDish;
      updateDish(dishId, updatedDish)
        .then(res.redirect("/admin/display"))
        .catch(err => console.log(err));

    } else {
      res.redirect("/admin");
    }
  });

  router.post("/display/:id/delete", (req, res) => {
    const dishId = req.params.id;
    if (req.session.isAuthenticated) {
      deleteDish(dishId)
        .then(res.redirect("/admin/display"))
        .catch(err => console.log(err));
    } else {
      res.redirect("/admin");
    }
  });

  router.get("/display/new", (req, res) => {
    if (req.session.isAuthenticated) {
      res.render('addDish', { page: 'addNewDish' });
    } else {
      res.redirect("/admin");
    }
  });

  router.post("/display", (req, res) => {
    if (req.session.isAuthenticated) {
      addNewDish(req.body.newDish)
        .then(res.redirect("/admin/display"))
        .catch(err => console.log(err));
    } else {
      res.redirect("/admin");
    }
  });

  return router;
};

