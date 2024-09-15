using System.Security.Cryptography;

namespace CSCE590GroupProject.EmployeeFeed
{
    public static class PasswordGenerator
    {
        // Define default minimum and maximum password lengths.
        private const int DefaultMinPasswordLength = 8;
        private const int DefaultMaxPasswordLength = 12;

        // Define supported password characters divided into groups.
        // You can add or remove characters or groups as needed.
        private static readonly string PasswordCharsLcase = "abcdefgijkmnopqrstwxyz";
        private static readonly string PasswordCharsUcase = "ABCDEFGHJKLMNPQRSTWXYZ";
        private static readonly string PasswordCharsNumeric = "23456789";
        private static readonly string PasswordCharsSpecial = "*$-+?_&=!%{}/";

        public static string GeneratePassword(int length = 10)
        {
            if (length < DefaultMinPasswordLength || length > DefaultMaxPasswordLength)
                throw new ArgumentException($"Password length must be between {DefaultMinPasswordLength} and {DefaultMaxPasswordLength} characters.");

            // Create a local array containing supported password characters
            // grouped by types. You can remove any character groups not needed.
            char[][] charGroups =
            [
                PasswordCharsLcase.ToCharArray(),
                PasswordCharsUcase.ToCharArray(),
                PasswordCharsNumeric.ToCharArray(),
                PasswordCharsSpecial.ToCharArray()
            ];

            // Use a cryptographically secure random number generator
            using var rng = RandomNumberGenerator.Create();

            // Create an array for holding the password characters.
            var passwordChars = new char[length];

            // Collect the indices of character groups to ensure each group is represented.
            int[] charGroupsIndices = Enumerable.Range(0, charGroups.Length).ToArray();

            // Randomly shuffle the group indices and pick characters from each group
            Shuffle(charGroupsIndices, rng);

            // Generate the password
            for (int i = 0; i < charGroupsIndices.Length; i++)
            {
                int groupIdx = charGroupsIndices[i % charGroups.Length];
                passwordChars[i] = GetRandomCharacter(charGroups[groupIdx], rng);
            }

            // Fill the rest of the password array with random characters from any group
            for (int i = charGroupsIndices.Length; i < passwordChars.Length; i++)
            {
                int randomGroupIndex = GetRandomInt(rng, 0, charGroups.Length);
                passwordChars[i] = GetRandomCharacter(charGroups[randomGroupIndex], rng);
            }

            // Randomly shuffle the final password to ensure any group character positioning
            Shuffle(passwordChars, rng);

            // Convert the password to a string and return
            return new string(passwordChars);
        }

        private static char GetRandomCharacter(char[] characterGroup, RandomNumberGenerator rng)
        {
            int randomIndex = GetRandomInt(rng, 0, characterGroup.Length);
            return characterGroup[randomIndex];
        }

        private static int GetRandomInt(RandomNumberGenerator rng, int min, int max)
        {
            byte[] randomNumber = new byte[4];
            rng.GetBytes(randomNumber);
            int randomValue = BitConverter.ToInt32(randomNumber, 0);
            return Math.Abs(randomValue % (max - min)) + min;
        }

        private static void Shuffle<T>(T[] array, RandomNumberGenerator rng)
        {
            int n = array.Length;
            while (n > 1)
            {
                int k = GetRandomInt(rng, 0, n--);
                T temp = array[n];
                array[n] = array[k];
                array[k] = temp;
            }
        }
    }
}
