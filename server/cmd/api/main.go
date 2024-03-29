package main

import (
	"crypto/sha256"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if os.Getenv("APP_MODE") == "prod" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		err := godotenv.Load("../../.env")
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://go-ytdl.vercel.app", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Video-Title", "Video-Thumbnail", "Video-Author", "Video-Duration"},
		AllowCredentials: true,
		MaxAge:           5 * time.Hour,
	})) // Cors
	r.Use(AuthRequired()) // Auth

	routes := RoutesHandler{}
	r.GET("/ping", func(ctx *gin.Context) {
		ctx.JSON(http.StatusAccepted, gin.H{"success": true, "data": "pong"})
	})
	r.POST("/download", routes.extractAndDownloadVideo)

	// Lauch App
	r.Run(fmt.Sprintf(":%s", os.Getenv("PORT")))
}

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authorization := c.GetHeader("Authorization")

		ByteHash := sha256.Sum256([]byte(authorization))
		HashedPassword := fmt.Sprintf("%x", ByteHash[:])

		RightHashedPassword := os.Getenv("SERVER_RIGHT_HASHED_PASSWORD")

		if HashedPassword != RightHashedPassword {
			realm := "Basic realm=" + strconv.Quote("Incorrect Password")
			c.Header("WWW-Authenticate", realm)
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		c.Next()
	}
}
