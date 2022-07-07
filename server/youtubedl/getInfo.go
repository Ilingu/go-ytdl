package youtubedl

import (
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"time"

	"github.com/kkdai/youtube/v2"
)

type VideoInfos struct {
	Title     string
	Thumbnail string
	Author    string
	Duration  time.Duration
}

func YtDownloader(videoID string, ToMp3 bool) (VideoInfos, error) {
	client := youtube.Client{}

	video, err := client.GetVideo(videoID)
	if err != nil {
		return VideoInfos{}, err
	}

	formats := video.Formats.WithAudioChannels() // only get videos with audio
	stream, _, err := client.GetStream(video, &formats[0])
	if err != nil {
		return VideoInfos{}, err
	}

	VideoPath := fmt.Sprintf("%s/%s", getVideoDirPath(), videoID)

	file, err := os.Create(VideoPath + ".mp4")
	if err != nil {
		return VideoInfos{}, err
	}
	defer file.Close()

	_, err = io.Copy(file, stream)
	if err != nil {
		return VideoInfos{}, err
	}

	if ToMp3 {
		err = ExecCmd("ffmpeg", "-i", VideoPath+".mp4", VideoPath+".mp3")
		if err != nil {
			log.Println(err)
			return VideoInfos{}, err
		}
	}

	// Video Infos
	FilteredVideoInfos := VideoInfos{}
	if len(video.Thumbnails) > 0 {
		FilteredVideoInfos.Thumbnail = video.Thumbnails[0].URL
	}
	FilteredVideoInfos.Title = video.Title
	FilteredVideoInfos.Author = video.Author
	FilteredVideoInfos.Duration = video.Duration

	return FilteredVideoInfos, nil
}

func ExecCmd(name string, args ...string) error {
	c := exec.Command(name, args...)

	err := c.Start()
	if err != nil {
		return err
	}

	return c.Wait()
}

func getVideoDirPath() string {
	if os.Getenv("APP_MODE") == "prod" {
		return "."
	}
	return "../../videos"
}
