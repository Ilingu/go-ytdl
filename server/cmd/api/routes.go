package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"yt-downloader/youtubedl"

	"github.com/gin-gonic/gin"
)

type RoutesHandler struct{}

func (r RoutesHandler) extractAndDownloadVideo(c *gin.Context) {
	body, err := MarshalPostReq(c.Request.Body)
	if err != nil {
		ReturnErrorJSON(c, http.StatusInternalServerError, "Invalid Body")
		return
	}

	videoID, err := ParseVideoID(strings.TrimSpace(body.YoutubeURL))
	if err != nil {
		if videoID = strings.TrimSpace(body.VideoID); !isValidID(videoID) {
			ReturnErrorJSON(c, http.StatusInternalServerError, err.Error())
			return
		}
	}

	VideoInfo, err := youtubedl.YtDownloader(videoID, body.ToMp3)
	if err != nil {
		log.Println(err)
		ReturnErrorJSON(c, http.StatusInternalServerError, "Cannot Get Video Info")
		return
	}

	c.Header("Content-Disposition", "attachment")
	c.Header("Video-Title", VideoInfo.Title)
	c.Header("Video-Thumbnail", VideoInfo.Thumbnail)
	c.Header("Video-Author", VideoInfo.Author)
	c.Header("Video-Duration", VideoInfo.Duration.String())

	filepath := fmt.Sprintf("%s/%s", getVideoDirPath(), videoID)
	Mp4, Mp3 := filepath+".mp4", filepath+".mp3"

	if body.ToMp3 {
		c.File(Mp3)
		c.Header("Content-Type", "video/mp3")

		err = os.Remove(Mp3)
		if err != nil {
			log.Printf("Cannot Delete File %s.mp3\n", videoID)
		}
	} else {
		c.Header("Content-Type", "video/mp4")
		c.File(Mp4)
	}

	err = os.Remove(Mp4)
	if err != nil {
		log.Printf("Cannot Delete File %s.mp4\n", videoID)
	}
}
