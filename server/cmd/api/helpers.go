package main

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"os"
	"regexp"
	"unicode"

	"github.com/gin-gonic/gin"
)

type PostYtId struct {
	VideoID    string `json:"videoID,omitempty"`
	YoutubeURL string `json:"youtubeURL,omitempty"`
	ToMp3      bool   `json:"toMp3"`
}

func ReturnSuccessJSON(c *gin.Context, data ...any) {
	resData := gin.H{"success": true}
	if len(data) != 0 {
		resData["data"] = data[0]
	}

	c.JSON(http.StatusOK, resData)
}

func ReturnErrorJSON(c *gin.Context, code int, reason ...string) {
	ErrReason := gin.H{"success": false}
	if len(reason) != 0 {
		ErrReason["reason"] = reason[0]
	}

	c.JSON(code, ErrReason)
}

func MarshalPostReq(UnparsedBody io.ReadCloser) (*PostYtId, error) {
	var body PostYtId
	err := json.NewDecoder(UnparsedBody).Decode(&body)
	if err != nil {
		return nil, err
	}

	return &body, nil
}

func isValidID(id string) bool {
	for _, ch := range id {
		if unicode.IsSymbol(ch) {
			return false
		}
	}
	return len(id) == 11
}

func ParseVideoID(unparsedUrl string) (string, error) {
	regEx := `(?mi:(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11}))`
	re := regexp.MustCompile(regEx)

	if !re.MatchString(unparsedUrl) {
		return "", errors.New("invalid youtube url")
	}

	Submatch := re.FindStringSubmatch(unparsedUrl)
	if len(Submatch) < 1 {
		return "", errors.New("cannot extract video id")
	}

	VideoId := Submatch[1]
	if !isValidID(VideoId) {
		return "", errors.New("invalid video id")
	}

	return VideoId, nil
}

func getVideoDirPath() string {
	if os.Getenv("APP_MODE") == "prod" {
		return "."
	}
	return "../../videos"
}
