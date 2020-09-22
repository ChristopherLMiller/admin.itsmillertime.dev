"use strict";

const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    // object to store query parameters
    let queryParams;

    // Apply correct parameters based on user auth state
    if (ctx.state.user) {
      // user is authenticated so lets just pass the query as is for now
      queryParams = {
        ...ctx.query,
      };
    } else {
      // user is not authenticated, only return published, public data
      queryParams = {
        ...ctx.query,
        status: "PUBLISHED",
        visibility: "PUBLIC",
      };
    }

    let entities;
    if (queryParams._q) {
      entities = await strapi.services.gallery.search(queryParams);
    } else {
      entities = await strapi.services.gallery.find(queryParams);
    }

    let finalEntitiesList = [];

    if (ctx.state.user) {
      // ok so now that we have all the entities we need to filter out results
      entities.forEach((entity) => {
        switch (entity.visibility) {
          case "PRIVATE": {
            if (ctx.state.user.role.type === "administrator") {
              finalEntitiesList.push(entity);
            }
            break;
          }
          case "PROTECTED": {
            switch (entity.status) {
              case "PUBLISHED": {
                // use a filter to see if the role is present on the entity
                const results = entity.roles.filter(
                  (entity) => entity.type === ctx.state.user.role.type
                );
                if (results) finalEntitiesList.push(entity);
                break;
              }
              case "DRAFT":
              case "UNPUBLISHED": {
                if (ctx.state.user.role.type === "administrator") {
                  finalEntitiesList.push(entity);
                }
                break;
              }
            }
            break;
          }
          case "PUBLIC": {
            switch (entity.status) {
              case "PUBLISHED": {
                finalEntitiesList.push(entity);
                break;
              }
              case "DRAFT":
              case "UNPUBLISHED": {
                if (ctx.state.user.role.type === "administrator") {
                  finalEntitiesList.push(entity);
                }
                break;
              }
            }
            break;
          }
        }
      });
    } else {
      finalEntitiesList = entities;
    }

    console.log(finalEntitiesList);

    return finalEntitiesList.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.gallery })
    );
  },
};
