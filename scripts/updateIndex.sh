

if [[ $# -lt 1 ]] ; then
    echo 'Usage: updateIndex.sh <accession or url>'
    exit 1
fi


fileToChange=~/dev/atlas-experiment/html/index.html

url=$1
if [ $(echo $url | grep --quiet 'E-*-*' ) ]
then
  url= "http://localhost:8080/gxa/experiments/$url"
fi

line=$(grep -n content: $fileToChange | cut -f1 -d:)

cat <(head -n $(echo $line - 1 | bc ) $fileToChange) <(curl -s $url | grep content: | tail -n 1) <(tail -n +"$(echo $line + 1 | bc)" $fileToChange) > $fileToChange.swp

diffCount=$(diff $fileToChange $fileToChange.swp | wc -l )

if [ "$diffCount" -gt 5 ]
then
  echo "Something went wrong, diff count too large: $diffCount"
  exit 1
elif [ "$diffCount" -eq 2 ]
then
  echo "Something went wrong, probably failed to load the page you asked for "
  rm $fileToChange.swp
  exit 1
else
  mv $fileToChange.swp $fileToChange
fi
