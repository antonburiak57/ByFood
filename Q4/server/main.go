package main

import (
	"os"
	"server/routes"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8000"
	}

	router := gin.New()
	router.Use(gin.Logger())

	router.Use(cors.Default())

	// Endpoints for CRUD
	router.POST("/user/create", routes.AddUser)
	router.GET("/users", routes.GetUsers)
	router.GET("/user/:id/", routes.GetUserById)
	router.PUT("/user/update/:id", routes.UpdateUser)
	router.DELETE("/user/delete/:id", routes.DeleteUser)

	router.Run(":" + port)
}