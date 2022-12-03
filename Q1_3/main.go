package main

import (
	"fmt"
	"sort"
	"strings"
	"unicode/utf8"
)

func main() {
	//Q1
	arr1 := []string{"aaaasd", "a", "aab", "aaabcd", "ef", "cssssssd", "fdz", "kf", "zc", "lklklklklklklklkl", "l"}
	fmt.Println(sortByNumberOfA(arr1))

	//Q2
	arr2 := []int{}
	fmt.Println(reverseArr(recursiveSpec(9, arr2)))

	//Q3
	arr3 := []string{"apple", "pie", "apple", "red", "red", "red"}
	fmt.Println(mostFrequent(arr3))
}

func sortByNumberOfA(arr []string) []string {
	sort.Slice(arr, func(i, j int) bool {
		s1, s2 := arr[i], arr[j]
		count1, count2 := strings.Count(s1, "a"), strings.Count(s2, "a")
		if count1 != count2 {
			return count1 > count2
		}
		return utf8.RuneCountInString(s1) > utf8.RuneCountInString(s2)
	})

	return arr
}

func mostFrequent(arr []string) string {
	m := map[string]int{}
	var maxCnt int
	var freq string
	for _, a := range arr {
		m[a]++
		if m[a] > maxCnt {
			maxCnt = m[a]
			freq = a
		}
	}

	return freq
}

func recursiveSpec(n int, arr []int) []int {
	if n <= 2 {
		arr = append(arr, 2)
		return arr
	}

	arr = append(arr, n)

	return recursiveSpec(n/2, arr)
}

func reverseArr[T any](original []T) (reversed []T) {
	reversed = make([]T, len(original))
	copy(reversed, original)

	for i := len(reversed)/2 - 1; i >= 0; i-- {
		tmp := len(reversed) - 1 - i
		reversed[i], reversed[tmp] = reversed[tmp], reversed[i]
	}

	return
}