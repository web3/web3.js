#!/bin/bash
# Get the new header name from the command line argument
header_name=$1

# Check if the header name is provided
if [ -z "$header_name" ]; then
  echo "Please provide a header name as the first argument"
  exit 1
fi
changelog="CHANGELOG.md"
headers_of_updates=() #this will track which kinds of headers are met in changelog.mds (Added, fixed, etc...)
# declare -A arr
declare -A my_array


# Append the new header name to the main ($changelog) file
# echo "" >> $changelog
# echo "$header_name" >> $changelog
sed -i "" "s/\[Unreleased\]/$header_name/g" $changelog
echo "" >> $changelog

# Find all $($changelog) files in the packages/**/ folders
for file in $(find packages -name $changelog -not -path "*node_modules*"); do

    lines_count=$(awk '/\[Unreleased\]/,EOF' $file | awk 'NF' | wc -l)
    # Check if there are any non-empty lines

    if [ $lines_count -gt 1 ]; then
  	echo "There are $lines_count non-empty lines under the [Unreleased] header in $package_name"

    	# Extract the package name from the file path
    	package_name=$(echo $file | awk -F '/' '{print $(NF-1)}')

	sed -i "" "s/\[Unreleased\]/$header_name/g" $file

	# Create new Unreleased header in changelog.md of package
	# echo "" >> $file
    	# echo "## [Unreleased]" >> $file

	# echo "######"
	# echo $lines_count
	# echo "### $package_name" >> $changelog
	# echo "" >> $changelog


	# Extract the unreleased changes from the ($changelog) file
	echo $header_name
	# unreleased_changes=$(awk '/\[$header_name\]/,EOF' $file)
	unreleased_changes=$(awk "/$header_name/,EOF" $file)
	echo $unreleased_changes
	#     echo $unreleased_changes | wc -l 
	# Replace the [Unreleased] header with the new header name
	unreleased_changes=${unreleased_changes//## $header_name}
	echo "The unreleased changes after pattern delete $unreleased_changes"
	echo '----'
	IFS=$'\n' read -d '' -r -a lines <<< "$unreleased_changes"
	# echo $lines
	for line in "${lines[@]}"; do
		echo $line
		index=-1
		if [[ $line =~ ^\#\#\# ]]; then
        		# Remove the `###` characters and trim whitespaces
        		header=$(echo "$line" | sed 's/\#\#\#//g' | xargs)
			echo "%%%%%%"
			echo $header
			echo "%%%%%%"
		fi
	# 	if [[ $line =~ ^\#+ ]]; then
	# 	header=$line
	# 	#     echo "" >> changelog.md
	# 	echo "$header" 

	# 	# else
	# 	#     echo "  $line" >> changelog.md
	# 	fi
	done

	# exit

	# Append the modified unreleased changes to the main ($changelog)s file
	echo "$unreleased_changes" >> $changelog
	echo "" >> $changelog

#     else
  	# echo "There are no non-empty lines under the [Unreleased] header"
    fi

done
declare -a my_array

echo "changelogs have been appended to $changelog"



