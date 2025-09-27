# Oh My Posh prompt
oh-my-posh init fish --config ~/.poshthemes/tokyonight_storm.omp.json | source

if status is-interactive
    # LSD aliases
    alias ls="lsd --group-dirs=first --icon=always --color=always"
    alias ll="lsd -lh --group-dirs=first --icon=always --color=always"
    alias la="lsd -lha --group-dirs=first --icon=always --color=always"

    # Git shortcuts
    alias gs="git status"
    alias ga="git add ."
    alias gc="git commit -m"
    alias gp="git push"
    alias gl="git pull"

    # Utils
    alias cat="batcat --style=plain --paging=never"
    alias cls="clear"
    alias ..="cd .."
    alias ...="cd ../.."
end

set -Ux PATH $HOME/.local/share/fnm $PATH; fnm env --use-on-cd | source
