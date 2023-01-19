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
changes=()
# echo ${#changes[@]}

# Append the new header name to the main ($changelog) file
# echo "" >> $changelog
# echo "$header_name" >> $changelog
sed -i "" "s/\[Unreleased\]/"\[$header_name\]"/g" $changelog
echo "" >>$changelog

# Find all $($changelog) files in the packages/**/ folders
for file in $(find packages -name $changelog -not -path "*node_modules*"); do

	lines_count=$(awk '/\[Unreleased\]/,EOF' $file | awk 'NF' | wc -l)

	# Check if there are any non-empty lines, meaning we have
	if [ $lines_count -gt 1 ]; then
		# echo "There are $lines_count non-empty lines under the [Unreleased] header in $package_name"

		# Extract the package name from the file path
		package_name=$(echo $file | awk -F '/' '{print $(NF-1)}')

		sed -i "" "s/\[Unreleased\]/$header_name/g" $file

		unreleased_changes=$(awk "/$header_name/,EOF" $file)

		#     echo $unreleased_changes | wc -l
		# Replace the [Unreleased] header with the new header name
		unreleased_changes=${unreleased_changes//## $header_name/}

		IFS=$'\n' read -d '' -r -a lines <<<"$unreleased_changes"
		lines+=("EOF")

		for line in "${lines[@]}"; do

			if [[ $line =~ ^\#\#\# || $line == EOF ]]; then
				# Just found a header of updates, check if we have already found it in a previous file
				# echo "Current changes for previous header $index"
				# echo $current_changes

				# If have found a previous header append the changes there (meaning: we found a new ### header, append to array all gathered ## headers)
				if [[ $index -ge 0 ]]; then
					# IFS=$'\n'
					changes[$index]+=$current_changes
					echo ${#changes[@]}
					# changes[$index]+=""
					# echo "********"
					# echo $changes[$index]
					# echo "********"
				fi
				index=-1 # the position of the header in the `headers_of_updates` array (Cannot use key-value ds in v3 bash)
				current_changes=""
				# Remove the `###` characters and trim whitespaces

				if [[ $line == EOF ]]; then
					# echo "This is the end of the file"
					break
				fi
				#todo maybe revert this comment
				# header=$(echo "$line" | sed 's/\#\#\#//g' | xargs)
				IFS=$'\n'
				header=$line
				# header+=$'\n'
				# header+=$'\n\n'
				# echo -e $header

				for i in "${!headers_of_updates[@]}"; do
					if [[ "${headers_of_updates[i]}" == "$header" ]]; then
						index=$i
						break
					fi
				done
				if ! [[ $index -ge 0 ]]; then
					# echo "Item already exists at position $index in the array"
					# else
					# Add the item to the array
					headers_of_updates+=("$header")
					index=$(expr ${#headers_of_updates[@]} - 1)
					# changes+=("")
					# echo "Item added at position $index to the array"
				fi
				# echo "${headers_of_updates[@]}"
				current_changes+="#### $package_name \n"
				# current_changes+=$'\n'
				# echo -e $current_changes
			else
				if [[ $line == -* ]]; then # True if line starts with a -
					# current_changes+=$'\n'
					# echo "***"
					# echo $line
					# echo "***"
					current_changes+="\n$line"
				else
					current_changes+=$line
				fi

			fi
		done

		echo "" >>$file
		echo -ne "[Unreleased]" >>$file
	fi

done
# echo "$unreleased_changes" >> $changelog
# echo "" >> $changelog
for i in "${!changes[@]}"; do
	#   echo "*****"
	#   echo "Index: $i, Item: ${headers_of_updates[i]}"
	#   echo "*****"
	echo -e ${headers_of_updates[i]} >>$changelog
	echo -e "" >>$changelog
	echo -e ${changes[i]} >>$changelog
	echo -e "" >>$changelog
done

echo "[Unreleased]" >>$changelog
